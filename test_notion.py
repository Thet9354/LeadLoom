import os
import json
from dotenv import load_dotenv
load_dotenv(override=True)
from api.database import supabase, decrypt
from api.notion_service import create_lead

res = supabase.table('integrations').select('notion_api_key, notion_db_id').eq('user_id', '49d71a6e-8218-4d9c-8c83-3ba61b22c404').execute()
if res.data:
    row = res.data[0]
    notion_api_key = decrypt(row.get('notion_api_key')) if row.get('notion_api_key') else os.environ.get("NOTION_API_KEY")
    notion_db_id = row.get('notion_db_id')
    
    print(f"Testing Notion DB: {notion_db_id}")
    
    dummy_data = {
        "name": "Test User",
        "email": "test@example.com",
        "company": "Test Corp",
        "priority": "High",
        "lead_source": ["Google", "Referral"],
        "value": "$10,000",
        "pain_point": "Needs testing",
        "next_steps": "Fix bug",
        "context": "Here is the hook"
    }
    
    result = create_lead(
        database_id=notion_db_id,
        lead_data=dummy_data,
        auth_token=notion_api_key
    )
    
    print(json.dumps(result, indent=2))
