import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(override=True)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

response = supabase.table("profiles").update({"current_month_sync_count": 0}).neq("id", "00000000-0000-0000-0000-000000000000").execute()
print(f"Reset complete. Data: {response.data}")
