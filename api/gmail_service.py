import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def get_service(refresh_token: str):
    """
    Returns an authorized Gmail API service instance using a refresh token.
    Instead of relying on a local token.pickle file, this generates on the fly.
    """
    if not refresh_token:
        raise ValueError("A valid Google refresh token is required.")

    client_id = os.environ.get("GOOGLE_CLIENT_ID")
    client_secret = os.environ.get("GOOGLE_CLIENT_SECRET")
    
    if not client_id or not client_secret:
         raise ValueError("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET map must be in .env")

    creds = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=SCOPES
    )

    try:
        service = build('gmail', 'v1', credentials=creds)
        return service
    except Exception as e:
        print(f"Error building Gmail service: {e}")
        return None

def fetch_recent_emails(service, max_results=10) -> list:
    """Fetches recent emails and extracts subject, sender, and text body."""
    if not service:
         return []
         
    try:
        results = service.users().messages().list(userId='me', maxResults=max_results, q="is:unread").execute()
        messages = results.get('messages', [])
        
        parsed_emails = []
        for msg in messages:
            full_msg = service.users().messages().get(userId='me', id=msg['id'], format='full').execute()
            payload = full_msg.get('payload', {})
            headers = payload.get('headers', [])
            
            subject = "No Subject"
            sender = "Unknown Sender"
            for header in headers:
                if header['name'].lower() == 'subject':
                    subject = header['value']
                if header['name'].lower() == 'from':
                    sender = header['value']
                    
            body = "No text content found."
            def extract_body(payload_data):
                if 'parts' in payload_data:
                    for part in payload_data['parts']:
                        if part.get('mimeType') == 'text/plain':
                            return part.get('body', {}).get('data', '')
                        elif 'parts' in part:
                            extracted = extract_body(part)
                            if extracted: return extracted
                else:
                    return payload_data.get('body', {}).get('data', '')
                return None
                
            body_data = extract_body(payload)
            if body_data:
                import base64
                try:
                    body = base64.urlsafe_b64decode(body_data).decode('utf-8', errors='ignore')
                except Exception:
                    pass
             
            parsed_emails.append({
                "id": msg['id'],
                "subject": subject,
                "sender": sender,
                "body": body
            })
        return parsed_emails
    except Exception as e:
        print(f"Error fetching emails: {e}")
        return []
