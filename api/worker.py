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
            .select("user_id, notion_db_id, notion_api_key, gmail_refresh_token, profiles!inner(id, email, is_pro, plan_type, trial_start_date, current_month_sync_count, onboarding_data)") \
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
            "onboarding_data": profile.get("onboarding_data"),
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
        gemini_api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        if gemini_api_key:
             from google import genai
             try:
                 print(f"  [+] Initializing Gemini Client (key found)...")
                 ai_client = genai.Client(api_key=gemini_api_key)
             except Exception as e:
                 print(f"  [!] Failed to initialize Gemini Client: {e}")
        else:
             print("  [!] GEMINI_API_KEY not found in environment.")

        # 4. Push to User's Specific Notion Database
        success_count = 0
        for email in emails:
             
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

             # Default fallback is NOT_LEAD to prevent spam syncing on API failure
             status = "NOT_LEAD"
             reason = "Fallback: Missing body content or AI parsing failed."
             company = "Unknown Company"
             priority = "Medium"
             lead_source = ["Unknown"]
             lead_stage = "New Inbound"
             value = "Unknown"
             pain_point = "None identified"
             next_steps = "Review inquiry"
             hook = email.get("subject", "")
             
             if ai_client and email.get("body"):
                  # Build brand context if onboarding_data exists
                  brand_ctx = ""
                  ob_data = user.get("onboarding_data")
                  if ob_data and isinstance(ob_data, dict):
                      bname = ob_data.get("business_name", "")
                      bdesc = ob_data.get("business_description", "")
                      target = ob_data.get("target_lead", "")
                      tone = ob_data.get("tone", "")
                      cta = ob_data.get("cta_link", "")
                      if bname:
                          brand_ctx += f"\nBRAND CONTEXT: You are evaluating leads for \"{bname}\"."
                      if bdesc:
                          brand_ctx += f" They {bdesc}."
                      if target:
                          brand_ctx += f" Their ideal lead profile: {target}."
                      if tone:
                          brand_ctx += f" Use a {tone} tone in your Hook."
                      if cta:
                          brand_ctx += f" Include this CTA in your Hook: {cta}."

                  domain_type = "a business domain" if is_business_domain else "a personal/free domain"
                  prompt = f"""
                 Role: You are a senior Sales Development Representative for an elite company.
                 Analyze the following email from a sender using {domain_type}.
                 {brand_ctx}
                 
                 Stage A (The Gatekeeper): Determine if the email is a LEAD or NOT_LEAD based on the user's qualified lead profile.
                 - NOT_LEAD Criteria: Cold pitches TO the user (SEO, Trademark, Ads), generic newsletters, automated receipts, or "Thank you" notes.
                 - LEAD Criteria: Inquiries about pricing, features, partnerships, or meeting requests.
                 
                 Stage B (The Router): If it is a LEAD, assign exactly ONE of these 9 stages based on the email content:
                 - Meeting Booked: If it's a Calendly/booking confirmation.
                 - Negotiating: If they ask about pricing, "Pro Tier", or upgrades.
                 - Needs Research: If they have complex technical questions (e.g., "Webflow integration?").
                 - Emailed / Attempted: If the subject starts with "RE:" (detected follow-up).
                 - Onboarding: If they mention having just paid or need account setup help.
                 - Disqualified: If they explicitly say "Not interested" or "Stop."
                 - New Inbound: Default for fresh, non-specific inquiries.
                 (The remaining two stages are "Closed Won" and "Closed Lost").
                 
                 Additional Extractions if LEAD:
                 - Extract their company name (if obvious, else "Unknown Company").
                 - Determine PRIORITY: "High", "Medium", or "Low".
                 - Identify LEAD_SOURCE: If no source is mentioned, output exactly "LeadLooms Website".
                 - Estimate Potential Revenue (VALUE): (e.g., "$19/mo" or "15 SDR seats") or set as "(Stealth Mode)".
                 - Extract PAIN_POINT: Max 2 bullet points (scannable for Notion).
                 - Extract NEXT_STEPS: Max 2 bullet points (scannable for Notion).
                 - HOOK: Create a personalized 'Hook' sentence to use in a reply.
                 
                 Return the output STRICTLY in this JSON-like key-value format exactly:
                  STATUS: [LEAD | NOT_LEAD]
                  REASON: [Short explanation of why]
                  COMPANY: [Company Name]
                  PRIORITY: [Priority Level]
                  LEAD_SOURCE: [Source]
                  LEAD_STAGE: [Chosen Stage]
                  VALUE: [Estimated Potential Revenue or (Stealth Mode)]
                  PAIN_POINT: [Max 2 bullet points]
                  NEXT_STEPS: [Max 2 bullet points]
                  HOOK: [Your Hook]

                  Subject: {email.get("subject", "")}
                  Body: {email.get("body", "")}
                  """
                  try:
                      print(f"    [AI] Analyzing email: \"{email.get('subject', 'No Subject')}\"")
                      body_sample = email.get('body', '')[:150].replace('\n', ' ')
                      print(f"    [AI] Extracted Body (first 150 chars): {body_sample!r}")
                      
                      response = ai_client.models.generate_content(
                          model='gemini-2.5-flash',
                          contents=prompt
                      )
                      import re
                      ai_text = response.text
                      print(f"    [AI] Raw Gemini Output:\n{ai_text}\n    [AI] --- End Output ---")
                      
                      # Robust regex parsing to handle markdown bolding e.g., "**COMPANY:** Value" or "**COMPANY**: Value"
                      def extract_field(field_name, text, default=""):
                          match = re.search(rf"(?i)\**{field_name}\**\s*:\s*\**\s*(.*)", text)
                          if not match: return default
                          val = match.group(1).strip()
                          # Remove bolding around the value if Gemini did "**Value**"
                          val = re.sub(r"^\**|\**$", "", val).strip()
                          return val
                      
                      status = extract_field("STATUS", ai_text, "NOT_LEAD").upper()
                      if "NOT_LEAD" in status: status = "NOT_LEAD"
                      else: status = "LEAD"
                      
                      reason = extract_field("REASON", ai_text)
                      company = extract_field("COMPANY", ai_text, "Unknown Company")
                      priority = extract_field("PRIORITY", ai_text, "Medium")
                      
                      source_str = extract_field("LEAD_SOURCE", ai_text, "LeadLooms Website")
                      lead_source = [src.strip() for src in source_str.split(',') if src.strip()]
                      
                      lead_stage = extract_field("LEAD_STAGE", ai_text, "New Inbound")
                      value = extract_field("VALUE", ai_text, "(Stealth Mode)")
                      pain_point = extract_field("PAIN_POINT", ai_text, "None identified")
                      next_steps = extract_field("NEXT_STEPS", ai_text, "Review inquiry")
                      hook = extract_field("HOOK", ai_text)
                      
                  except Exception as e:
                      print(f"  [!] Gemini Error: {e}")
                      company = "Pending Parsing"
             else:
                 company = "Pending Parsing"

             # Process based on STATUS
             if status == "NOT_LEAD":
                 print(f"    - Skipping non-lead from {sender_email}. Reason: {reason}")
                 # Remove label so it doesn't stay unread and get re-processed
                 remove_unread_label(gmail_service, email["id"])
                 continue

             lead_data = {
                 "name": raw_sender,
                 "email": sender_email,
                 "company": company,
                 "priority": priority,
                 "lead_source": lead_source,
                 "lead_stage": lead_stage,
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
                  # Acknowledge ONLY after successful sync or specific status decisions
                  remove_unread_label(gmail_service, email["id"])
                  
                  # Build a summary from AI output for dashboard tooltip
                  summary_parts = []
                  if company and company != "Pending Parsing":
                      summary_parts.append(f"Company: {company}")
                  if reason:
                      summary_parts.append(reason)
                  if hook:
                      summary_parts.append(hook[:120])
                  ai_summary = " — ".join(summary_parts) if summary_parts else ""
                  insert_sync_log(user_id=user_id, lead_email=sender_email, summary=ai_summary)
                  increment_sync_count(user_id=user_id)
             else:
                  print(f"    ✗ Failed to sync lead: {result.get('error')}")
                  
        print(f"  Sync complete: {success_count}/{len(emails)} leads successfully pushed to Notion.")


if __name__ == "__main__":
    run_all_syncs()
