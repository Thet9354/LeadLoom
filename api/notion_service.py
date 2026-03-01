import os
import re
import notion_client

def _extract_notion_db_id(raw_id: str) -> str:
    """
    Extracts a clean Notion database UUID from various formats:
    - Full URL: https://www.notion.so/312dff50c8e08048bc06e56796e3bcbc?v=...
    - 32-char hex: 312dff50c8e08048bc06e56796e3bcbc
    - UUID with dashes: 312dff50-c8e0-8048-bc06-e56796e3bcbc
    Returns a UUID formatted with dashes for the Notion API.
    """
    # Strip whitespace and quotes
    raw_id = raw_id.strip().strip('"').strip("'")
    
    # If it's a URL, extract the 32-char hex from the path
    if 'notion.so' in raw_id or 'notion.site' in raw_id:
        # Match 32 hex chars in the URL path
        match = re.search(r'([a-f0-9]{32})', raw_id)
        if match:
            hex_id = match.group(1)
            # Format as UUID with dashes
            return f"{hex_id[:8]}-{hex_id[8:12]}-{hex_id[12:16]}-{hex_id[16:20]}-{hex_id[20:]}"
    
    # If it's a 32-char hex without dashes, add them
    clean = raw_id.replace('-', '')
    if re.match(r'^[a-f0-9]{32}$', clean):
        return f"{clean[:8]}-{clean[8:12]}-{clean[12:16]}-{clean[16:20]}-{clean[20:]}"
    
    # Already a valid UUID or unknown format — return as-is
    return raw_id

def create_lead(database_id: str, lead_data: dict, auth_token: str = None) -> dict:
    """
    Creates a new lead entry in the specified Notion Database.
    
    Args:
        database_id: The ID of the Notion Database to insert into.
        lead_data: A dictionary containing 'name', 'email', 'company', etc.
        auth_token: The Notion API key (if None, attempts to use env var).
    """
    token = auth_token or os.environ.get("NOTION_API_KEY")
    if not token:
        raise ValueError("Notion API Key is required.")
    
    # Clean the database_id (handle full URLs, hex strings, etc.)
    clean_db_id = _extract_notion_db_id(database_id)
        
    client = notion_client.Client(auth=token)
    
    try:
        new_page = client.pages.create(
            parent={"database_id": clean_db_id},
            properties={
                "Name": {
                    "title": [
                        {
                            "text": {
                                "content": lead_data.get("name", "Unknown Lead")
                            }
                        }
                    ]
                },
                "Email": {
                    "email": lead_data.get("email", "")
                },
                "Company": {
                    "rich_text": [
                        {
                            "text": {
                                "content": lead_data.get("company", "")
                            }
                        }
                    ]
                },
                "Context": {
                    "rich_text": [
                        {
                            "text": {
                                "content": lead_data.get("context", "")
                            }
                        }
                    ]
                }
            }
        )
        return {"success": True, "page_id": new_page["id"]}
    except Exception as e:
        print(f"Error creating Notion lead: {e}")
        return {"error": str(e)}
