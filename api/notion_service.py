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
    Dynamically queries the DB schema first, then only sets properties that exist.
    
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
        # 1. Query the database schema to find which properties actually exist
        db_info = client.databases.retrieve(database_id=clean_db_id)
        
        # If the user provided a Linked Database View, it won't have properties.
        # We must follow the data_source to the original database to get the schema.
        if not db_info.get("properties") and db_info.get("data_sources"):
            source_id = db_info["data_sources"][0]["id"]
            print(f"  [Notion] Detected Linked View. Fetching schema from source DB: {source_id}")
            try:
                db_info = client.databases.retrieve(database_id=source_id)
            except Exception as e:
                print(f"  [Notion] Could not read source DB schema (permissions issue?). Falling back to standard template properties. Error: {e}")
            
        db_props = db_info.get("properties", {})
        
        # Create a normalized map: "lowercase stripped name" -> "Actual Exact Name"
        normalized_props = {k.strip().lower(): k for k in db_props.keys()}
        print(f"  [Notion] DB properties normalized: {list(normalized_props.keys())}")
        
        # Helper to get the actual property name safely
        def get_prop(name):
            if normalized_props:
                return normalized_props.get(name.lower())
            return name # Fallback explicitly to the requested name if schema is totally hidden
        
        # 2. Find the title property (it might not be called "Name")
        title_prop_name = "Name"
        for prop_name, prop_info in db_props.items():
            if prop_info.get("type") == "title":
                title_prop_name = prop_name
                break
        
        # 3. Build properties dict
        properties = {}
        
        # Title property (required)
        properties[title_prop_name] = {
            "title": [{"text": {"content": lead_data.get("name", "Unknown Lead")[:2000]}}]
        }
        
        email_prop = get_prop("Email")
        if email_prop:
            val = lead_data.get("email", "")
            if val: properties[email_prop] = {"email": val}
        
        company_prop = get_prop("Company")
        if company_prop:
            properties[company_prop] = {
                "rich_text": [{"text": {"content": lead_data.get("company", "")[:2000]}}]
            }
        
        # Context / Hook / AI Intelligence 🧠
        context_prop = get_prop("AI Intelligence 🧠") or get_prop("Context") or get_prop("Hook")
        if context_prop:
            properties[context_prop] = {
                "rich_text": [{"text": {"content": lead_data.get("context", "")[:2000]}}]
            }
        
        priority_prop = get_prop("Priority")
        if priority_prop:
            val = lead_data.get("priority", "Medium")
            # Ensure it fits within Notion's 100 char limit for selects
            properties[priority_prop] = {"select": {"name": val[:100]}}
        
        # Lead Source / Acquisition Channel
        source_prop = get_prop("Acquisition Channel") or get_prop("Lead Source")
        if source_prop:
            sources = lead_data.get("lead_source", ["Unknown"])
            properties[source_prop] = {
                "multi_select": [{"name": src[:100]} for src in sources]
            }
            
        # Lead Stage / Lead Status
        stage_prop = get_prop("Lead Stage") or get_prop("Lead Status")
        if stage_prop:
            val = lead_data.get("lead_stage", "New Inbound")
            properties[stage_prop] = {"select": {"name": val[:100]}}
            
        # Value / Potential Revenue
        value_prop = get_prop("Potential Revenue") or get_prop("Value")
        if value_prop:
            properties[value_prop] = {
                "rich_text": [{"text": {"content": lead_data.get("value", "Unknown")[:2000]}}]
            }
            
        pain_prop = get_prop("Pain Point")
        if pain_prop:
            properties[pain_prop] = {
                "rich_text": [{"text": {"content": lead_data.get("pain_point", "None identified")[:2000]}}]
            }
            
        next_prop = get_prop("Next Steps")
        if next_prop:
            properties[next_prop] = {
                "rich_text": [{"text": {"content": lead_data.get("next_steps", "")[:2000]}}]
            }
            
        print(f"  [Notion] Setting properties: {list(properties.keys())}")
        
        # 4. Create the page
        new_page = client.pages.create(
            parent={"database_id": clean_db_id},
            properties=properties
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
