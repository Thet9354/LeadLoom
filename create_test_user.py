import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv(override=True)

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Missing Supabase credentials in .env")
    exit(1)

supabase = create_client(url, key)

try:
    # Use the admin API to create a verified user
    user = supabase.auth.admin.create_user({
        "email": "local_tester@example.com",
        "password": "testerpassword123",
        "email_confirm": True
    })
    print(f"SUCCESS_ID:{user.user.id}")
except Exception as e:
    # If user already exists, just fetch them
    print(f"Error creating user (might already exist): {e}")
    users = supabase.auth.admin.list_users()
    for u in users:
        if u.email == "local_tester@example.com":
             print(f"SUCCESS_ID:{u.id}")
