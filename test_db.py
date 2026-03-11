import os
from dotenv import load_dotenv
load_dotenv(override=True)
from api.database import supabase

# Log all integration rows for this user
res = supabase.table('integrations').select('*').eq('user_id', '49d71a6e-8218-4d9c-8c83-3ba61b22c404').execute()
print(f"Number of rows found: {len(res.data)}")
for i, row in enumerate(res.data):
    print(f"\nRow {i+1}:")
    for k, v in row.items():
        if v and len(str(v)) > 50:
            print(f"  {k}: {str(v)[:20]}...[TRUNCATED]")
        else:
            print(f"  {k}: {v}")
