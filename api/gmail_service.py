import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.modify']

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
                queue = [payload_data]
                html_data = ""
                while queue:
                    curr = queue.pop(0)
                    if 'parts' in curr:
                        queue.extend(curr['parts'])
                    else:
                        mime = curr.get('mimeType')
                        bdata = curr.get('body', {}).get('data', '')
                        if mime == 'text/plain' and bdata:
                            return bdata
                        elif mime == 'text/html' and bdata:
                            html_data = bdata
                return html_data if html_data else payload_data.get('body', {}).get('data', '')
                
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

def remove_unread_label(service, message_id: str) -> bool:
    """Removes the UNREAD label from a message."""
    if not service:
        return False
        
    try:
        service.users().messages().modify(
            userId='me',
            id=message_id,
            body={'removeLabelIds': ['UNREAD']}
        ).execute()
        return True
    except Exception as e:
        print(f"Error removing UNREAD label for message {message_id}: {e}")
        return False
