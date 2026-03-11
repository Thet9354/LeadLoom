import urllib.request, json, os
from dotenv import load_dotenv
load_dotenv(override=True)
from api.database import decrypt, supabase
res = supabase.table('integrations').select('notion_api_key, notion_db_id').eq('user_id', '49d71a6e-8218-4d9c-8c83-3ba61b22c404').execute()
row = res.data[0]
token = decrypt(row.get('notion_api_key')) if row.get('notion_api_key') else os.environ.get('NOTION_API_KEY')
db_id = row.get('notion_db_id').split('?')[0].split('/')[-1]

payload = {
    "parent": {"database_id": db_id},
    "properties": {
        "Name": {"title": [{"text": {"content": "Test Priority API"}}]},
        "Priority": {"select": {"name": "High"}},
        "Lead Source": {"multi_select": [{"name": "Google"}]}
    }
}
req = urllib.request.Request('https://api.notion.com/v1/pages', data=json.dumps(payload).encode('utf-8'), headers={'Authorization': f'Bearer {token}', 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json'})
try:
    resp = urllib.request.urlopen(req)
    print("SUCCESS")
except urllib.error.HTTPError as e:
    print(e.read())
