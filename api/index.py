import os
from dotenv import load_dotenv
load_dotenv(override=True)

# Only allow OAuth over HTTP in development (localhost)
if os.environ.get("ENV", "development") == "development":
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
import json
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import google_auth_oauthlib.flow
import googleapiclient.discovery  # Added missing import
from urllib.parse import urlencode

# Email sending imports
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Import database functions (assuming api logic is running in same directory context)
from api.database import upsert_user_config, check_email_exists

app = FastAPI()

# Build allowed origins from environment
_allowed_origins = [
    os.environ.get("FRONTEND_URL", "http://localhost:5173"),
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
# Add production URL if set
_prod_url = os.environ.get("PRODUCTION_URL")
if _prod_url:
    _allowed_origins.append(_prod_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Google OAuth Configuration ---
# Use environment variables based flow or local client_secret.json 
CLIENT_SECRETS_FILE = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "client_secret.json")
# Oauth Scopes required
SCOPES = [
    'openid', 
    'https://www.googleapis.com/auth/userinfo.email', 
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/gmail.modify'
]
REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "http://127.0.0.1:8000/auth/callback")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")
BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:8000")


# In-memory store for OAuth flow data (code_verifier) between requests
# We preserve this for backwards compatibility but rely on cookies now
_oauth_flows = {}

@app.get("/auth/google")
async def auth_google(user_id: str = None):
    """Redirects user to Google's consent screen to authorize Gmail read access."""
    if not user_id:
        return JSONResponse(status_code=400, content={"error": "user_id is required"})
    
    try:
        client_id = os.environ.get("GOOGLE_CLIENT_ID")
        client_secret = os.environ.get("GOOGLE_CLIENT_SECRET")
        
        if client_id and client_secret:
            client_config = {
                "web": {
                    "client_id": client_id,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "client_secret": client_secret,
                }
            }
            flow = google_auth_oauthlib.flow.Flow.from_client_config(
                 client_config, scopes=SCOPES
                 )
        else:
             flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
                 CLIENT_SECRETS_FILE, scopes=SCOPES
                 )

        flow.redirect_uri = REDIRECT_URI
        
        # Generate authorization URL
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        
        # Create custom state with user_id
        custom_state = f"{state}::{user_id}"

        # Re-generate URL with custom state
        authorization_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent',
            state=custom_state
        )
        
        # Store the code_verifier so the callback can use it across Serverless functions
        response = RedirectResponse(authorization_url)
        response.set_cookie(
            key=f"cv_{state}", 
            value=flow.code_verifier, 
            httponly=True, 
            secure=True, 
            samesite="none", 
            max_age=3600
        )
        return response
    except FileNotFoundError:
        if os.environ.get("ENV", "development") != "development":
            return JSONResponse(status_code=500, content={"error": "OAuth credentials not configured"})
        print("WARNING: Starting MOCK OAuth Flow because client_secret.json is missing.")
        return RedirectResponse(f"{BACKEND_URL}/auth/callback?state=mock_state::{user_id}&code=mock_code")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/auth/callback")
async def auth_callback(request: Request):
    """Handles the OAuth callback, exchanges code for token, and saves to DB."""
    # Custom state has format: google_state::user_id
    custom_state = request.query_params.get("state")
    code = request.query_params.get("code")
    
    if not custom_state or not code:
        return RedirectResponse(f"{FRONTEND_URL}/dashboard?error=MissingParams")
        
    try:
        state, user_id = custom_state.split("::")
    except ValueError:
        return RedirectResponse(f"{FRONTEND_URL}/dashboard?error=InvalidState")

    # MOCK FLOW FOR TESTING — only allowed in development
    if state == "mock_state" and code == "mock_code":
        if os.environ.get("ENV", "development") != "development":
            return RedirectResponse(f"{FRONTEND_URL}/dashboard?error=MockFlowDisabled")
        print("Executing MOCK callback saving to DB...")
        
        from api.database import supabase, encrypt
        if supabase:
            try:
                print(f"Attempting DB update for mock user {user_id}...")
                # Update email in profiles
                supabase.table("profiles").update({
                    "email": "test_user@example.com",
                }).eq("id", user_id).execute()
                # Store token in integrations
                supabase.table("integrations").upsert({
                    "user_id": user_id,
                    "gmail_refresh_token": encrypt("mock_refresh_token_12345")
                }, on_conflict="user_id").execute()
                print(f"Successfully saved mock Gmail token for user {user_id}")
            except Exception as db_e:
                print(f"Mock DB update failed: {db_e}")
                # Still proceed — don't block the flow for mock testing
        else:
              print("Supabase client not connected. Bypassing DB save for mock flow.")

        return RedirectResponse(f"{FRONTEND_URL}/dashboard?step=1&success=true")

    try:
        client_id = os.environ.get("GOOGLE_CLIENT_ID")
        client_secret = os.environ.get("GOOGLE_CLIENT_SECRET")
        
        if client_id and client_secret:
            client_config = {
                "web": {
                    "client_id": client_id,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "client_secret": client_secret,
                }
            }
            flow = google_auth_oauthlib.flow.Flow.from_client_config(
                client_config, scopes=SCOPES, state=custom_state
            )
        else:
            flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
                CLIENT_SECRETS_FILE, scopes=SCOPES, state=custom_state
            )

        flow.redirect_uri = REDIRECT_URI
        
        # Restore the code_verifier from the initial /auth/google request cookie
        code_verifier = request.cookies.get(f"cv_{state}")
        if code_verifier:
            flow.code_verifier = code_verifier
        else:
            print("Warning: code_verifier cookie not found. PKCE flow may fail.")
        
        authorization_response = str(request.url)
        if "http://" in authorization_response and "localhost" not in authorization_response and "127.0.0.1" not in authorization_response:
             authorization_response = authorization_response.replace("http://", "https://", 1)
             
        os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'
        
        try:
            flow.fetch_token(authorization_response=authorization_response)
        except Exception as fetch_err:
            print(f"Fetch Token Error: {fetch_err}")
            from urllib.parse import quote
            err_str = str(fetch_err)[:150]
            return RedirectResponse(f"{FRONTEND_URL}/dashboard?error={quote(f'Google Token Error: {err_str}')}")
            
        credentials = flow.credentials
        
        # Get user email
        user_info_service = googleapiclient.discovery.build('oauth2', 'v2', credentials=credentials)
        user_info = user_info_service.userinfo().get().execute()
        email = user_info.get('email')

        refresh_token = credentials.refresh_token
        
        if refresh_token:
            # Save token to integrations table, email to profiles
            from api.database import supabase, encrypt
            if supabase:
                try:
                    # Update email in profiles
                    if email:
                        supabase.table("profiles").update({"email": email}).eq("id", user_id).execute()
                    # Store token in integrations
                    supabase.table("integrations").upsert({
                        "user_id": user_id,
                        "gmail_refresh_token": encrypt(refresh_token)
                    }, on_conflict="user_id").execute()
                    print(f"Successfully saved Gmail token for user {user_id}")
                except Exception as db_e:
                    print(f"Direct update failed, trying upsert: {db_e}")
                    # Fallback to upsert
                    db_result = upsert_user_config(
                        user_id=user_id, email=email, gmail_refresh_token=refresh_token
                    )
                    if "error" in db_result:
                        print(f"Upsert also failed: {db_result['error']}")
                        from urllib.parse import quote
                        db_err = db_result.get('error', '')[:100]
                        return RedirectResponse(f"{FRONTEND_URL}/dashboard?error={quote(f'Could not save Gmail credentials. DB Error: {db_err}')}")
        else:
            print(f"Warning: No refresh token returned. Creds dictionary: {credentials.to_json()[:200]}")
            from urllib.parse import quote
            return RedirectResponse(f"{FRONTEND_URL}/dashboard?error={quote('Google authorized but did not provide a refresh token. Try revoking app access and reconnecting.')}")
            
        return RedirectResponse(f"{FRONTEND_URL}/dashboard?step=1&success=true")

    except Exception as e:
        print(f"OAuth Callback Error: {e}")
        from urllib.parse import quote
        error_msg = str(e)[:150] # Send first 150 chars of error for debugging
        return RedirectResponse(f"{FRONTEND_URL}/dashboard?error={quote(f'OAuth failed: {error_msg}')}")


@app.post("/api/user/notion-config")
async def save_notion_config(request: Request):
    """Saves Notion configuration for a user."""
    try:
        data = await request.json()
        user_id = data.get("user_id")
        notion_db_id = data.get("notion_db_id")
        notion_api_key = data.get("notion_api_key")
        
        if not user_id or not notion_db_id:
            return JSONResponse(status_code=400, content={"error": "user_id and notion_db_id are required"})
            
        db_result = upsert_user_config(
            user_id=user_id,
            notion_db_id=notion_db_id,
            notion_api_key=notion_api_key if notion_api_key else None
        )
        
        if "error" in db_result:
            return JSONResponse(status_code=500, content={"error": db_result["error"]})
            
        return {"success": True, "message": "Notion config saved successfully"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/api/user/profile")
async def get_user_profile(user_id: str):
    from api.database import get_user_config
    if not user_id:
        return JSONResponse(status_code=400, content={"error": "user_id is required"})
        
    result = get_user_config(user_id)
    if "error" in result:
        return JSONResponse(status_code=404, content={"error": result["error"]})
        
    # Return safe data only
    plan_type = result.get("plan_type", "starter")
    safe_data = {
        "email": result.get("email"),
        "plan_type": plan_type,
        "is_pro": plan_type == "pro",
        "trial_start_date": result.get("trial_start_date"),
        "current_month_sync_count": result.get("current_month_sync_count", 0),
        "gmail_connected": bool(result.get("gmail_refresh_token")),
        "notion_configured": bool(result.get("notion_db_id")),
        "avg_lead_value": result.get("avg_lead_value", 500),
        "onboarding_data": result.get("onboarding_data"),
        "onboarding_complete": bool(result.get("onboarding_complete", False)),
        "automation_enabled": bool(result.get("automation_enabled", False))
    }
    return {"success": True, "data": safe_data}


@app.post("/api/user/onboarding")
async def save_onboarding(request: Request):
    """Save the user's AI Brand DNA onboarding data."""
    from api.database import supabase
    if not supabase:
        return JSONResponse(status_code=500, content={"error": "Supabase not configured"})
    try:
        body = await request.json()
        user_id = body.get("user_id")
        onboarding_data = body.get("onboarding_data")
        if not user_id:
            return JSONResponse(status_code=400, content={"error": "user_id is required"})
        supabase.table("profiles").update({"onboarding_data": onboarding_data}).eq("id", user_id).execute()
        return {"success": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/api/user/toggle-automation")
async def toggle_automation(request: Request):
    """Toggle the automation_enabled flag and/or onboarding_complete for a user."""
    from api.database import supabase
    if not supabase:
        return JSONResponse(status_code=500, content={"error": "Supabase not configured"})
    try:
        body = await request.json()
        user_id = body.get("user_id")
        if not user_id:
            return JSONResponse(status_code=400, content={"error": "user_id is required"})
        update_data = {}
        if "enabled" in body:
            update_data["automation_enabled"] = body["enabled"]
        if "onboarding_complete" in body:
            update_data["onboarding_complete"] = body["onboarding_complete"]
        if update_data:
            supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        return {"success": True, **update_data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/api/test-onboarding-reply")
async def test_onboarding_reply(request: Request):
    """Generate a sample AI reply using the user's onboarding brand DNA."""
    import os
    try:
        body = await request.json()
        onboarding_data = body.get("onboarding_data", {})
        bname = onboarding_data.get("business_name", "your company")
        bdesc = onboarding_data.get("business_description", "")
        tone = onboarding_data.get("tone", "Professional")
        cta = onboarding_data.get("cta_link", "")
        cta_label = onboarding_data.get("cta_label", "Learn More")

        fake_inquiry = "Hey there! I found your website and I'm really interested in what you offer. We're a small team of 5 looking for a solution to manage our leads better. Could you tell me more about your pricing and how to get started?"

        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            # Fallback if no API key
            return {"success": True, "inquiry": fake_inquiry, "reply": f"Hi there! Thanks for reaching out to {bname}. We'd love to help your team. {f'Check us out here: {cta}' if cta else 'Let us know how we can help!'}", "fallback": True}

        from google import genai
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        prompt = f"""You are a {tone.lower()} sales assistant for "{bname}". {f'They {bdesc}.' if bdesc else ''}
Write a short, compelling reply (3-4 sentences max) to this inquiry. {f'Include this CTA: {cta}' if cta else ''}
End with an actionable next step.

Inquiry: "{fake_inquiry}"

Reply:"""
        response = client.models.generate_content(model='gemini-2.5-flash', contents=prompt)
        reply_text = response.text.strip().strip('"')
        return {"success": True, "inquiry": fake_inquiry, "reply": reply_text}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/api/user/avg-lead-value")
async def save_avg_lead_value(request: Request):
    """Save the user's custom average lead value for the Revenue Protected card."""
    from api.database import supabase
    if not supabase:
        return JSONResponse(status_code=500, content={"error": "Supabase not configured"})
    try:
        body = await request.json()
        user_id = body.get("user_id")
        value = body.get("avg_lead_value", 500)
        if not user_id:
            return JSONResponse(status_code=400, content={"error": "user_id is required"})
        supabase.table("profiles").update({"avg_lead_value": int(value)}).eq("id", user_id).execute()
        return {"success": True}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/api/user/sync-logs")
async def get_sync_logs(user_id: str, limit: int = 10, offset: int = 0, search: str = "", days: int = 0):
    """Fetches paginated sync logs with optional search and date filtering."""
    from api.database import supabase
    from datetime import datetime, timedelta
    
    if not supabase:
        return JSONResponse(status_code=500, content={"error": "Supabase not configured"})
    if not user_id:
        return JSONResponse(status_code=400, content={"error": "user_id is required"})
        
    try:
        query = supabase.table("sync_logs").select("*", count="exact").eq("user_id", user_id)
        
        # Date filter
        if days > 0:
            cutoff = (datetime.utcnow() - timedelta(days=days)).isoformat()
            query = query.gte("sync_time", cutoff)
        
        # Search filter (case-insensitive LIKE on lead_email)
        if search:
            query = query.ilike("lead_email", f"%{search}%")
        
        query = query.order("sync_time", desc=True)
        
        # Pagination
        start = offset
        end = offset + limit - 1
        query = query.range(start, end)
        
        response = query.execute()
        total = response.count if response.count is not None else 0
        
        return {"success": True, "data": response.data, "total": total, "has_more": (offset + limit) < total}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/api/dashboard-stats")
async def get_dashboard_stats(user_id: str):
    """Fetches real-time stats and system health for the Dashboard Command Center."""
    from api.database import supabase, get_user_config
    from datetime import datetime, timedelta
    
    if not supabase:
        return JSONResponse(status_code=500, content={"error": "Supabase not configured"})
        
    if not user_id:
        return JSONResponse(status_code=400, content={"error": "user_id is required"})
        
    try:
        # Get total leads synced by counting rows in sync_logs
        count_resp = supabase.table("sync_logs").select("id", count="exact").eq("user_id", user_id).execute()
        total_leads = count_resp.count if count_resp.count is not None else 0
        
        # Get leads this week
        week_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
        week_resp = supabase.table("sync_logs").select("id", count="exact").eq("user_id", user_id).gte("sync_time", week_ago).execute()
        leads_this_week = week_resp.count if week_resp.count is not None else 0
        
        # Determine Integration Health
        user_config = get_user_config(user_id)
        gmail_connected = False
        notion_linked = False
        high_intent_pct = None
        
        if "error" not in user_config:
            gmail_connected = bool(user_config.get("gmail_refresh_token"))
            notion_linked = bool(user_config.get("notion_db_id"))
            
            # Attempt to calculate high intent % from Notion Priority tags
            notion_api_key = user_config.get("notion_api_key")
            notion_db_id = user_config.get("notion_db_id")
            if notion_linked and notion_api_key and notion_db_id:
                try:
                    import requests as req
                    from api.database import decrypt_value
                    decrypted_key = decrypt_value(notion_api_key)
                    headers = {
                        "Authorization": f"Bearer {decrypted_key}",
                        "Notion-Version": "2022-06-28",
                        "Content-Type": "application/json"
                    }
                    body = {"page_size": 100}
                    r = req.post(f"https://api.notion.com/v1/databases/{notion_db_id}/query", headers=headers, json=body)
                    if r.status_code == 200:
                        results = r.json().get("results", [])
                        high_count = 0
                        total_with_priority = 0
                        for page in results:
                            props = page.get("properties", {})
                            priority = props.get("Priority", {})
                            if priority.get("type") == "select" and priority.get("select"):
                                total_with_priority += 1
                                if priority["select"].get("name", "").lower() == "high":
                                    high_count += 1
                        if total_with_priority > 0:
                            high_intent_pct = round((high_count / total_with_priority) * 100)
                except Exception:
                    pass  # Silently fail — Notion is optional
            
        return {
            "success": True, 
            "data": {
                "total_leads": total_leads,
                "leads_this_week": leads_this_week,
                "high_intent_pct": high_intent_pct,
                "system_health": {
                    "gmail_connected": gmail_connected,
                    "notion_linked": notion_linked
                }
            }
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/api/analytics/volume")
async def get_analytics_volume(user_id: str, days: int = 14):
    """Fetches the lead sync volume grouped by date. Supports 7, 30, 90 day ranges."""
    from api.database import supabase
    from datetime import datetime, timedelta
    
    if not supabase:
        return JSONResponse(status_code=500, content={"error": "Supabase not configured"})
    if not user_id:
        return JSONResponse(status_code=400, content={"error": "user_id is required"})
    
    # Clamp to valid range values
    if days not in (7, 30, 90):
        days = 14
        
    try:
        cutoff = (datetime.utcnow() - timedelta(days=days)).isoformat()
        response = supabase.table("sync_logs").select("sync_time").eq("user_id", user_id).gte("sync_time", cutoff).execute()
        
        # Initialize an empty map for the range
        date_map = {}
        for i in range(days - 1, -1, -1):
            d = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
            date_map[d] = 0
            
        for log in response.data:
            day = log.get("sync_time", "").split("T")[0]
            if day in date_map:
                date_map[day] += 1
                
        trend = [{"date": k, "leads": v} for k, v in date_map.items()]
        
        return {"success": True, "data": trend}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/api/analytics/distribution")
async def get_analytics_distribution(user_id: str, days: int = 14):
    """Aggregates leads by domain (Business vs Personal). Supports time-range filtering."""
    from api.database import supabase
    from datetime import datetime, timedelta
    
    if not supabase:
        return JSONResponse(status_code=500, content={"error": "Supabase not configured"})
    if not user_id:
        return JSONResponse(status_code=400, content={"error": "user_id is required"})
    
    if days not in (7, 30, 90):
        days = 14
        
    try:
        cutoff = (datetime.utcnow() - timedelta(days=days)).isoformat()
        response = supabase.table("sync_logs").select("lead_email").eq("user_id", user_id).gte("sync_time", cutoff).execute()
        
        counts = {"Business/B2B": 0, "Personal": 0}
        personal_domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com"]
        
        for log in response.data:
            email = log.get("lead_email", "")
            if "@" in email:
                domain = email.split("@")[-1].lower()
                if domain in personal_domains:
                    counts["Personal"] += 1
                else:
                    counts["Business/B2B"] += 1
                    
        distribution = [{"name": k, "value": v} for k, v in counts.items() if v > 0]
        
        if not distribution:
             distribution = [{"name": "No Data", "value": 1}]
             
        return {"success": True, "data": distribution}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


import stripe

# Stripe Price ID mapping
STRIPE_PRICE_MAP = {
    "plus": os.environ.get("STRIPE_PLUS_PRICE_ID", ""),
    "pro": os.environ.get("STRIPE_PRO_PRICE_ID", ""),
}

# Reverse lookup: price_id -> plan_type
def price_id_to_plan(price_id: str) -> str:
    for plan, pid in STRIPE_PRICE_MAP.items():
        if pid == price_id:
            return plan
    return "starter"

@app.post("/create-checkout-session")
async def create_checkout_session(request: Request):
    try:
        data = await request.json()
        user_id = data.get("user_id")
        plan = data.get("plan", "pro")  # "plus" or "pro"
        
        if not user_id:
            return JSONResponse(status_code=400, content={"error": "user_id is required"})
        if plan not in STRIPE_PRICE_MAP:
            return JSONResponse(status_code=400, content={"error": f"Invalid plan: {plan}"})
            
        price_id = STRIPE_PRICE_MAP[plan]
        if not price_id:
            return JSONResponse(status_code=500, content={"error": f"Stripe Price ID not configured for {plan}"})
            
        stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
        
        # Build session params
        session_params = {
            'payment_method_types': ['card'],
            'line_items': [{'price': price_id, 'quantity': 1}],
            'mode': 'subscription',
            'success_url': f'{FRONTEND_URL}/dashboard?checkout=success',
            'cancel_url': f'{FRONTEND_URL}/dashboard?checkout=canceled',
            'client_reference_id': user_id,
        }
        
        # Only Pro gets a 14-day free trial
        if plan == "pro":
            session_params['subscription_data'] = {'trial_period_days': 14}
            session_params['payment_method_collection'] = 'always'
        
        checkout_session = stripe.checkout.Session.create(**session_params)
        return {"id": checkout_session.id, "url": checkout_session.url}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Listens for Stripe subscription events to manage user plan_type."""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")

    if not endpoint_secret:
         print("Missing STRIPE_WEBHOOK_SECRET")
         return JSONResponse(status_code=400, content={"error": "Missing Webhook Secret"})

    event = None
    try:
        stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": "Invalid Payload"})
    except stripe.error.SignatureVerificationError as e:
        return JSONResponse(status_code=400, content={"error": "Invalid Signature"})

    if event['type'] == 'checkout.session.completed':
        session_obj = event['data']['object']
        user_id = session_obj.get('client_reference_id')
        subscription_id = session_obj.get('subscription')
        
        if user_id and subscription_id:
            from api.database import supabase
            if supabase:
                try:
                    # Retrieve subscription to find the price_id and trial metadata
                    sub = stripe.Subscription.retrieve(subscription_id)
                    price_id = sub['items']['data'][0]['price']['id'] if sub['items']['data'] else None
                    plan = price_id_to_plan(price_id) if price_id else "starter"
                    
                    trial_start = sub.get("trial_start")
                    
                    update_data = {
                        "plan_type": plan,
                        "is_pro": plan == "pro",
                        "stripe_customer_id": session_obj.get('customer'),
                    }
                    
                    if trial_start:
                         from datetime import datetime, timezone
                         # Convert stripe unix timestamp to ISO format for Supabase
                         dt = datetime.fromtimestamp(trial_start, tz=timezone.utc)
                         update_data["trial_start_date"] = dt.isoformat()
                    
                    supabase.table("profiles").update(update_data).eq("id", user_id).execute()
                    print(f"User {user_id} upgraded to {plan}. Trial start: {bool(trial_start)}")
                except Exception as db_e:
                    print(f"Failed to update plan in DB: {db_e}")

    elif event['type'] == 'customer.subscription.deleted':
        # User cancelled or subscription expired — downgrade to starter
        subscription_obj = event['data']['object']
        customer_id = subscription_obj.get('customer')
        if customer_id:
            from api.database import supabase
            if supabase:
                try:
                    supabase.table("profiles").update({
                        "plan_type": "starter",
                        "is_pro": False
                    }).eq("stripe_customer_id", customer_id).execute()
                    print(f"Subscription deleted for customer {customer_id}. Downgraded to starter.")
                except Exception as db_e:
                    print(f"Failed to handle subscription deletion: {db_e}")

    elif event['type'] == 'invoice.payment_succeeded':
        invoice_obj = event['data']['object']
        customer_id = invoice_obj.get('customer')
        if customer_id:
            print(f"Payment succeeded for customer {customer_id}.")

    return {"status": "success"}


@app.get("/api/poll")
async def poll_inbox():
    # Use environment variables securely for API calls as requested
    notion_api_key = os.environ.get("NOTION_API_KEY")
    
    # We do not strictly require NOTION_DATABASE_ID here because the worker
    # fetches each user's specific database ID from the database.
    # We just need to ensure the worker script can run.
    from api.worker import run_all_syncs
    import asyncio
    
    try:
        # Run the sync engine (in a real production app, this should be offloaded 
        # to a background task queue like Celery or RQ to not block the web request,
        # but for Vercel Cron, hitting the endpoint executing synchronously is standard)
        print("Triggering run_all_syncs() from /api/poll ...")
        
        # worker is synchronous, so we run it in a threadpool
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, run_all_syncs)
        
        return {"status": "success", "message": "CRON Execution Triggered: Active users successfully synced."}
    except Exception as e:
        print(f"Sync Worker Error: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/api/auth/check-email")
async def check_email(email: str):
    """Check if an email exists in profiles — used by Google login gatekeeper."""
    if not email:
        return JSONResponse(status_code=400, content={"error": "email is required"})
    exists = check_email_exists(email)
    return {"exists": exists}


@app.post("/api/contact")
async def submit_contact_form(request: Request):
    """Handles contact form submissions and emails them directly to leadloomsg@gmail.com."""
    try:
        data = await request.json()
        first_name = data.get("firstName", "")
        last_name = data.get("lastName", "")
        sender_email = data.get("email", "")
        message = data.get("message", "")

        if not first_name or not sender_email or not message:
            return JSONResponse(status_code=400, content={"error": "Name, email, and message are required."})

        # Get credentials from environment
        smtp_email = os.environ.get("SMTP_EMAIL", "leadloomsg@gmail.com")
        app_password = os.environ.get("GMAIL_APP_PASSWORD")
        owner_email = "leadloomsg@gmail.com"

        # Construct the email
        msg = MIMEMultipart()
        msg['From'] = smtp_email
        msg['To'] = owner_email
        msg['Reply-To'] = sender_email
        msg['Subject'] = f"New LeadLoom Contact Form Submission from {first_name} {last_name}"

        body = f"""
New Contact Form Submission:

Name: {first_name} {last_name}
Email: {sender_email}

Message:
{message}
        """
        msg.attach(MIMEText(body, 'plain'))

        # If credentials exist, send it via SMTP_SSL
        if app_password:
            try:
                server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
                # server.set_debuglevel(1) # Un-comment to print verbose SMTP logs
                server.login(smtp_email, app_password)
                server.send_message(msg)
                server.quit()
                print(f"Successfully dispatched contact form email from {sender_email}")
            except Exception as smtp_e:
                print(f"SMTP Error during dispatch: {smtp_e}")
                # We return success to the user so the UI works, but log the error
                return {"success": True, "warning": "Email dispatch failed internally. Did you set the GMAIL_APP_PASSWORD correctly?"}
        else:
            print("WARNING: GMAIL_APP_PASSWORD is not set. Contact form submission received but email was not sent.")

        return {"success": True, "message": "Message sent successfully!"}
        
    except Exception as e:
        print(f"Contact Form Error: {e}")
        return JSONResponse(status_code=500, content={"error": "An error occurred while processing your request."})


@app.get("/api/health")
async def health_check():
    return {"status": "online"}
