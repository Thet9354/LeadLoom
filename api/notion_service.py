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
                },
                "Priority": {
                    "select": {
                        "name": lead_data.get("priority", "Medium")
                    }
                },
                "Lead Source": {
                    "multi_select": [{"name": src} for src in lead_data.get("lead_source", ["Unknown"])]
                },
                "Lead Stage": {
                    "select": {
                        "name": lead_data.get("lead_stage", "New Inbound")
                    }
                },
                "Value": {
                    "rich_text": [
                        {
                            "text": {
                                "content": lead_data.get("value", "Unknown")
                            }
                        }
                    ]
                },
                "Pain Point": {
                    "rich_text": [
                        {
                            "text": {
                                "content": lead_data.get("pain_point", "None identified")
                            }
                        }
                    ]
                },
                "Next Steps": {
                    "rich_text": [
                        {
                            "text": {
                                "content": lead_data.get("next_steps", "")
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

def get_notion_analytics(api_key: str, db_id: str) -> dict:
    """Fetch recent leads from Notion and calculate pipeline stats."""
    if not api_key or not db_id:
        return {"error": "Missing credentials"}
    try:
        clean_db_id = _extract_notion_db_id(db_id)
        if not clean_db_id:
            return {"error": "Invalid Database ID format"}
            
        client = notion_client.Client(auth=api_key)
        
        # Query the database
        results = client.databases.query(
            **{
                "database_id": clean_db_id,
                "page_size": 100,
            }
        )
        
        pages = results.get("results", [])
        
        pipeline_distribution = {}
        trend_data_map = {}
        closed_won = 0
        total_valid = len(pages)
        
        for page in pages:
            props = page.get("properties", {})
            created_time = page.get("created_time")
            
            # Extract stage safely
            stage = "New Inbound"
            if "Lead Stage" in props and props["Lead Stage"].get("select") and props["Lead Stage"]["select"]:
                stage = props["Lead Stage"]["select"].get("name", "New Inbound")
                
            pipeline_distribution[stage] = pipeline_distribution.get(stage, 0) + 1
            if stage == "Closed Won":
                closed_won += 1
                
            # Extract trend (YYYY-MM-DD)
            if created_time:
                date_str = created_time.split("T")[0]
                trend_data_map[date_str] = trend_data_map.get(date_str, 0) + 1

        # Format trend data
        sorted_dates = sorted(trend_data_map.keys())
        trend_data = [{"date": d, "leads": trend_data_map[d]} for d in sorted_dates]
        
        # Format pipeline distribution for Recharts Pie (name, value)
        pipeline_arr = [{"name": k, "value": v} for k, v in pipeline_distribution.items()]
        
        # Calculate conversion rate
        conversion_rate = 0
        if total_valid > 0:
            conversion_rate = round((closed_won / total_valid) * 100, 1)
            
        return {
            "success": True,
            "pipeline": pipeline_arr,
            "trend": trend_data,
            "conversion_rate": conversion_rate,
            "total_fetched": total_valid
        }
    except Exception as e:
        print(f"Notion Analytics Error: {e}")
        return {"error": str(e)}
