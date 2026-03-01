import os
from supabase import create_client, Client
from cryptography.fernet import Fernet
import json

# Setup Supabase client
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None
    print("WARNING: Supabase credentials missing.")

# Setup Encryption Config
ENCRYPTION_KEY = os.environ.get("ENCRYPTION_KEY")
if ENCRYPTION_KEY:
    try:
        fernet = Fernet(ENCRYPTION_KEY.encode())
    except Exception as e:
        print(f"WARNING: Invalid ENCRYPTION_KEY provided. {e}")
        fernet = None
else:
    fernet = None
    print("WARNING: ENCRYPTION_KEY missing. Sensitive data will not be encrypted.")


def encrypt(data_str: str) -> str:
    """Encrypt a string and return as a UTF-8 string."""
    if not fernet or not data_str:
        return data_str
    encrypted_bytes = fernet.encrypt(data_str.encode("utf-8"))
    return encrypted_bytes.decode("utf-8")


def decrypt(encrypted_str: str) -> str:
    """Decrypt a string back to original UTF-8."""
    if not fernet or not encrypted_str:
        return encrypted_str
    decrypted_bytes = fernet.decrypt(encrypted_str.encode("utf-8"))
    return decrypted_bytes.decode("utf-8")


def check_email_exists(email: str) -> bool:
    """Check if an email already exists in the profiles table."""
    if not supabase or not email:
        return False
    try:
        response = supabase.table("profiles").select("id").eq("email", email).execute()
        return bool(response.data)
    except Exception as e:
        print(f"Email check error: {e}")
        return False


def upsert_user_config(user_id: str, email: str = None, notion_api_key: str = None, notion_db_id: str = None, gmail_refresh_token: str = None) -> dict:
    """Securely create or update a user's LeadLooms configuration.
    Profile fields go to 'profiles', integration fields go to 'integrations'.
    """
    if not supabase:
        return {"error": "Supabase client not configured"}

    # --- Update profiles table ---
    profile_data = {"id": user_id}
    if email is not None:
        profile_data["email"] = email

    if len(profile_data) > 1:  # has more than just id
        try:
            supabase.table("profiles").upsert(profile_data).execute()
        except Exception as e:
            print(f"DB Profile Upsert Error: {e}")
            return {"error": str(e)}

    # --- Update integrations table ---
    has_integration_fields = any(v is not None for v in [notion_api_key, notion_db_id, gmail_refresh_token])
    if has_integration_fields:
        integration_data = {"user_id": user_id}
        if notion_api_key is not None:
            integration_data["notion_api_key"] = encrypt(notion_api_key)
        if notion_db_id is not None:
            integration_data["notion_db_id"] = notion_db_id
        if gmail_refresh_token is not None:
            integration_data["gmail_refresh_token"] = encrypt(gmail_refresh_token)

        try:
            supabase.table("integrations").upsert(integration_data, on_conflict="user_id").execute()
        except Exception as e:
            print(f"DB Integrations Upsert Error: {e}")
            return {"error": str(e)}

    return {"success": True}


def get_user_config(user_id: str) -> dict:
    """Retrieve a user's configuration from profiles + integrations, decrypting sensitive fields."""
    if not supabase:
        return {"error": "Supabase client not configured"}

    try:
        # Fetch profile
        profile_resp = supabase.table("profiles").select("*").eq("id", user_id).execute()
        if not profile_resp.data:
            return {"error": "User not found"}

        user_data = profile_resp.data[0]

        # Fetch integrations
        integ_resp = supabase.table("integrations").select("*").eq("user_id", user_id).execute()
        if integ_resp.data:
            integ = integ_resp.data[0]
            user_data["notion_api_key"] = integ.get("notion_api_key")
            user_data["notion_db_id"] = integ.get("notion_db_id")
            user_data["gmail_refresh_token"] = integ.get("gmail_refresh_token")

        # Decrypt sensitive fields
        if user_data.get("notion_api_key"):
            user_data["notion_api_key"] = decrypt(user_data["notion_api_key"])
        if user_data.get("gmail_refresh_token"):
            user_data["gmail_refresh_token"] = decrypt(user_data["gmail_refresh_token"])

        return user_data
    except Exception as e:
        print(f"DB Fetch Error: {e}")
        return {"error": str(e)}


def insert_sync_log(user_id: str, lead_email: str) -> dict:
    """Record a successful sync operation in the sync_logs table."""
    if not supabase:
        return {"error": "Supabase client not configured"}

    try:
        response = supabase.table("sync_logs").insert({
            "user_id": user_id,
            "lead_email": lead_email
        }).execute()
        return response.data
    except Exception as e:
        print(f"DB Insert Sync Log Error: {e}")
        return {"error": str(e)}


def increment_sync_count(user_id: str) -> dict:
    """Increment the current_month_sync_count for a user by 1."""
    if not supabase:
        return {"error": "Supabase client not configured"}

    try:
        # Fetch current count from profiles
        response = supabase.table("profiles").select("current_month_sync_count").eq("id", user_id).execute()
        if not response.data:
            return {"error": "User not found"}

        current = response.data[0].get("current_month_sync_count", 0) or 0
        supabase.table("profiles").update({
            "current_month_sync_count": current + 1
        }).eq("id", user_id).execute()
        return {"success": True, "new_count": current + 1}
    except Exception as e:
        print(f"DB Increment Sync Count Error: {e}")
        return {"error": str(e)}
