import os
from dotenv import load_dotenv

# Load env before imports that dictate os.environ
load_dotenv(override=True)

from api.database import supabase, decrypt, insert_sync_log, increment_sync_count
from api.gmail_service import get_service, fetch_recent_emails, remove_unread_label
from api.notion_service import create_lead

def run_all_syncs():
    """
    The Multi-Tenant Engine.
    1. Fetches all users from Supabase.
    2. Initializes their specific Gmail and Notion services.
    3. Runs the synchronization loop.
    """
    if not supabase:
        print("CRITICAL ERROR: Supabase client not initialized.")
        return

    print("Starting Multi-Tenant Sync Cycle...")
    
    # Fetch all users who have both a Gmail token and a Notion DB mapping
    # Join integrations with profiles to get all needed fields
    try:
         query = supabase.table("integrations") \
            .select("user_id, notion_db_id, notion_api_key, gmail_refresh_token, profiles!inner(id, email, is_pro, plan_type, trial_start_date, current_month_sync_count)") \
            .not_.is_("gmail_refresh_token", "null") \
            .not_.is_("notion_db_id", "null") \
            .execute()
         raw_rows = query.data
    except Exception as e:
         print(f"Error fetching users from database: {e}")
         return
         
    if not raw_rows:
        print("No users found with valid sync configurations.")
        return

    # Flatten the joined data for backwards compatibility
    users = []
    for row in raw_rows:
        profile = row.get("profiles", {})
        users.append({
            "id": row["user_id"],
            "email": profile.get("email"),
            "notion_db_id": row.get("notion_db_id"),
            "notion_api_key": row.get("notion_api_key"),
            "gmail_refresh_token": row.get("gmail_refresh_token"),
            "is_pro": profile.get("is_pro"),
            "plan_type": profile.get("plan_type", "starter"),
            "trial_start_date": profile.get("trial_start_date"),
            "current_month_sync_count": profile.get("current_month_sync_count", 0),
        })
        
    print(f"Found {len(users)} active synced users.")

    for user in users:
        user_id = user["id"]
        user_email = user["email"]
        print(f"\n--- Syncing Lead Data for User: {user_email} ({user_id}) ---")
        
        # 0. Subscription & Sync Limit Guard
        plan_type = user.get("plan_type", "starter")
        sync_count = user.get("current_month_sync_count", 0) or 0
        
        # Plan limits
        plan_limits = {"starter": 30, "plus": 100, "pro": float('inf')}
        limit = plan_limits.get(plan_type, 30)
        
        # Check sync limit
        if sync_count >= limit:
            print(f"  [!] Sync limit reached ({sync_count}/{int(limit)}) on {plan_type} plan. Skipping.")
            insert_sync_log(user_id=user_id, lead_email="SYNC_LIMIT_REACHED")
            continue
        
        # Pro trial expiry check
        is_pro = plan_type == "pro"
        trial_start = user.get("trial_start_date")
        if is_pro and trial_start:
            from datetime import datetime, timezone
            try:
                start_dt = datetime.fromisoformat(trial_start.replace("Z", "+00:00"))
                days_elapsed = (datetime.now(timezone.utc) - start_dt).days
                if days_elapsed > 14:
                    print(f"  [!] Pro trial expired ({days_elapsed} days). Skipping sync.")
                    insert_sync_log(user_id=user_id, lead_email="SUBSCRIPTION_EXPIRED")
                    continue
            except Exception as e:
                print(f"  [!] Could not parse trial_start_date: {e}")
        elif not is_pro and plan_type == "starter":
            # Starter users with no trial — always allowed (within sync limit)
            pass
        
        # 1. Decrypt Credentials
        refresh_token = decrypt(user["gmail_refresh_token"])
        notion_db_id = user["notion_db_id"]
        
        notion_token = None
        if user.get("notion_api_key"):
            notion_token = decrypt(user["notion_api_key"])
        else:
             notion_token = os.environ.get("NOTION_API_KEY")
             if not notion_token:
                 print(f"  [!] No custom Notion API Key and no system default. Skipping.")
                 continue
            
        # 2. Initialize User-Specific Gmail Client
        try:
             gmail_service = get_service(refresh_token)
             if not gmail_service:
                  print(f"  [!] Failed to generate Gmail service. Token might be revoked.")
                  continue
        except Exception as e:
             print(f"  [!] Gmail Auth Error: {e}")
             continue
                     # 3. Fetch Unread Leads 
        print(f"  Fetching recent unread emails...")
        emails = fetch_recent_emails(gmail_service, max_results=5)
        
        if not emails:
             print("  No new leads found in inbox.")
             continue
             
        print(f"  Processing {len(emails)} new leads...")
        
        # Initialize Gemini Client if Key exists
        ai_client = None
        gemini_api_key = os.environ.get("GEMINI_API_KEY")
        if gemini_api_key:
             from google import genai
             try:
                 ai_client = genai.Client()
             except Exception as e:
                 print(f"  [!] Failed to initialize Gemini Client: {e}")

        # 4. Push to User's Specific Notion Database
        success_count = 0
        for email in emails:
             
             # Acknowledge immediately to prevent concurrent polling duplicates
             remove_unread_label(gmail_service, email["id"])
             
             raw_sender = email.get("sender", "")
             sender_email = raw_sender
             if "<" in raw_sender and ">" in raw_sender:
                 import re
                 match = re.search(r'<(.*?)>', raw_sender)
                 if match:
                     sender_email = match.group(1)

             # Extract sender domain for context
             is_business_domain = True
             if "@" in sender_email:
                 domain = sender_email.split("@")[-1].lower()
                 if domain in ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com"]:
                     is_business_domain = False

             status = "LEAD"
             reason = ""
             company = "Unknown Company"
             priority = "Medium"
             lead_source = "Unknown"
             value = "Unknown"
             pain_point = "None identified"
             next_steps = "Review inquiry"
             hook = email.get("subject", "")
             
             if ai_client and email.get("body"):
                 domain_type = "a business domain" if is_business_domain else "a personal/free domain"
                 prompt = f"""
                 You are an expert Sales Development Representative (SDR) evaluating inbound emails.
                 Analyze the following email from a potential lead. The sender is using {domain_type}.
                 
                 Determine if this is a genuine lead inquiring about our services/products, 
                 a possible lead (ambiguous but worth checking), or not a lead (spam, promotion, newsletter, internal, irrelevant).
                 
                 Extract their company name (if obvious, else "Unknown Company").
                 Create a personalized 'Hook' sentence to use in a reply (e.g., "I saw you're interested in XYZ...").
                 
                 Also extract or estimate the following 5 data points:
                 - PRIORITY: [High | Medium | Low] (High = ready to buy/book demo, Low = just asking questions/partnerships)
                 - LEAD_SOURCE: [Comma-separated list, e.g., "Google, Facebook" or "Referral" or "Unknown"]
                 - VALUE: [Mentioned budget, team size, e.g., "200 seats", "$5,000", or "Unknown"]
                 - PAIN_POINT: [What problem are they trying to solve?]
                 - NEXT_STEPS: [Actionable next step for the sales rep]
                 
                 Return the output STRICTLY in this JSON-like key-value format exactly:
                 STATUS: [LEAD | POSSIBLE_LEAD | NOT_LEAD]
                 REASON: [Short explanation of why]
                 COMPANY: [Company Name]
                 PRIORITY: [Priority Level]
                 LEAD_SOURCE: [Source]
                 VALUE: [Estimated Value or Size]
                 PAIN_POINT: [Pain Point]
                 NEXT_STEPS: [Next Steps]
                 HOOK: [Your Hook]

                 Subject: {email.get("subject", "")}
                 Body: {email.get("body", "")}
                 """
                 try:
                     response = ai_client.models.generate_content(
                         model='gemini-2.5-flash',
                         contents=prompt
                     )
                     lines = response.text.split('\n')
                     for line in lines:
                         line = line.strip()
                         if line.startswith("STATUS:"):
                             status = line.replace("STATUS:", "").strip()
                         elif line.startswith("REASON:"):
                             reason = line.replace("REASON:", "").strip()
                         elif line.startswith("COMPANY:"):
                             company = line.replace("COMPANY:", "").strip()
                         elif line.startswith("PRIORITY:"):
                             priority = line.replace("PRIORITY:", "").strip()
                         elif line.startswith("LEAD_SOURCE:"):
                             val = line.replace("LEAD_SOURCE:", "").strip()
                             # Parse comma separated for Multi-Select
                             lead_source = [src.strip() for src in val.split(',') if src.strip()]
                         elif line.startswith("VALUE:"):
                             value = line.replace("VALUE:", "").strip()
                         elif line.startswith("PAIN_POINT:"):
                             pain_point = line.replace("PAIN_POINT:", "").strip()
                         elif line.startswith("NEXT_STEPS:"):
                             next_steps = line.replace("NEXT_STEPS:", "").strip()
                         elif line.startswith("HOOK:"):
                             hook = line.replace("HOOK:", "").strip()
                 except Exception as e:
                     print(f"  [!] Gemini Error: {e}")
                     company = "Pending Parsing"
             else:
                 company = "Pending Parsing"

             # Process based on STATUS
             if status == "NOT_LEAD":
                 print(f"    - Skipping non-lead from {sender_email}. Reason: {reason}")
                 continue
                 
             if status == "POSSIBLE_LEAD":
                 hook = f"[POSSIBLE LEAD] Reason: {reason}\n\n{hook}"

             lead_data = {
                 "name": raw_sender,
                 "email": sender_email,
                 "company": company,
                 "priority": priority,
                 "lead_source": lead_source,
                 "value": value,
                 "pain_point": pain_point,
                 "next_steps": next_steps,
                 "context": hook
             }
             
             result = create_lead(
                 database_id=notion_db_id, 
                 lead_data=lead_data, 
                 auth_token=notion_token
             )
             
             if result.get("success"):
                  success_count += 1
                  print(f"    ✓ Synced lead from {sender_email} (Status: {status})")
                  insert_sync_log(user_id=user_id, lead_email=sender_email)
                  increment_sync_count(user_id=user_id)
             else:
                  print(f"    ✗ Failed to sync lead: {result.get('error')}")
                  
        print(f"  Sync complete: {success_count}/{len(emails)} leads successfully pushed to Notion.")


if __name__ == "__main__":
    run_all_syncs()
