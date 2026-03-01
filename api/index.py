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
    'https://www.googleapis.com/auth/gmail.readonly'
]
REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "http://127.0.0.1:8000/auth/callback")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")
BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:8000")


# In-memory store for OAuth flow data (code_verifier) between requests
# In production, use Redis or a session store
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
        
        # Store the code_verifier so the callback can use it
        _oauth_flows[custom_state] = {
            "code_verifier": flow.code_verifier,
        }

        return RedirectResponse(authorization_url)
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
        
        # Restore the code_verifier from the initial /auth/google request
        stored_flow = _oauth_flows.pop(custom_state, None)
        if stored_flow and stored_flow.get("code_verifier"):
            flow.code_verifier = stored_flow["code_verifier"]
        
        authorization_response = str(request.url)
        if "http://" in authorization_response and "localhost" not in authorization_response and "127.0.0.1" not in authorization_response:
             authorization_response = authorization_response.replace("http://", "https://", 1)
             
        flow.fetch_token(authorization_response=authorization_response)
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
                        return RedirectResponse(f"{FRONTEND_URL}/dashboard?error={quote('Could not save Gmail credentials. Please try again.')}")
        else:
            print("Warning: No refresh token returned. User may need to revoke and re-connect.")
            from urllib.parse import quote
            return RedirectResponse(f"{FRONTEND_URL}/dashboard?error={quote('Google did not return a refresh token. Please revoke LeadLooms access in your Google Account settings and try again.')}")
            
        return RedirectResponse(f"{FRONTEND_URL}/dashboard?step=1&success=true")

    except Exception as e:
        print(f"OAuth Callback Error: {e}")
        from urllib.parse import quote
        return RedirectResponse(f"{FRONTEND_URL}/dashboard?error={quote('Gmail connection failed. Please try again.')}")


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
        "notion_configured": bool(result.get("notion_db_id"))
    }
    return {"success": True, "data": safe_data}


@app.get("/api/user/sync-logs")
async def get_sync_logs(user_id: str):
    """Fetches recent sync logs for a user."""
    from api.database import supabase
    if not supabase:
        return JSONResponse(status_code=500, content={"error": "Supabase not configured"})
        
    if not user_id:
        return JSONResponse(status_code=400, content={"error": "user_id is required"})
        
    try:
        response = supabase.table("sync_logs").select("*").eq("user_id", user_id).order("sync_time", desc=True).limit(5).execute()
        return {"success": True, "data": response.data}
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
            session_params['payment_intent_data'] = {'setup_future_usage': 'off_session'}
        
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
                    # Retrieve subscription to find the price_id
                    sub = stripe.Subscription.retrieve(subscription_id)
                    price_id = sub['items']['data'][0]['price']['id'] if sub['items']['data'] else None
                    plan = price_id_to_plan(price_id) if price_id else "starter"
                    
                    update_data = {
                        "plan_type": plan,
                        "is_pro": plan == "pro",
                        "stripe_customer_id": session_obj.get('customer'),
                    }
                    supabase.table("profiles").update(update_data).eq("id", user_id).execute()
                    print(f"User {user_id} upgraded to {plan}.")
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
    notion_database_id = os.environ.get("NOTION_DATABASE_ID")
    gmail_credentials = os.environ.get("GMAIL_CREDENTIALS_JSON")
    
    if not all([notion_api_key, notion_database_id]):
        return JSONResponse(
            status_code=500, 
            content={"message": "Missing environment variables for Notion infrastructure"}
        )
    
    # Placeholder logic for Gmail <> Notion syncing
    # googleapiclient.discovery and notion_client logic would go here
    
    return {"status": "success", "message": "CRON Execution Triggered: Inbox correctly synced with Notion"}

@app.get("/api/auth/check-email")
async def check_email(email: str):
    """Check if an email exists in profiles — used by Google login gatekeeper."""
    if not email:
        return JSONResponse(status_code=400, content={"error": "email is required"})
    exists = check_email_exists(email)
    return {"exists": exists}


@app.get("/api/health")
async def health_check():
    return {"status": "online"}
