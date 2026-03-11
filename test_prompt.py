import urllib.request, json, os
from dotenv import load_dotenv
load_dotenv(override=True)
import google.generativeai as genai

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

prompt = """
You are an expert Sales Development Representative (SDR) evaluating inbound emails.
Analyze the following email from a potential lead. The sender is using a business domain.

Determine if this is a genuine lead inquiring about our services/products, 
a possible lead (ambiguous but worth checking), or not a lead (spam, promotion, newsletter, internal, irrelevant).

Extract their company name (if obvious, else "Unknown Company").
Create a personalized 'Hook' sentence to use in a reply (e.g., "I saw you're interested in XYZ...").

Also extract or estimate the following 6 data points:
- PRIORITY: Must be exactly "High", "Medium", or "Low" (High = ready to buy/book demo, Low = just asking questions/partnerships)
- LEAD_SOURCE: [Comma-separated list, e.g., "Google" or "Referral". If no source is mentioned, you MUST output exactly "LeadLooms Website"]
- LEAD_STAGE: Evaluate the email and pick exactly ONE of these 9 stages: "New Inbound", "Needs Research", "Emailed / Attempted", "Meeting Booked", "Negotiating", "Onboarding", "Closed Won", "Closed Lost", "Disqualified". (If it's a first touch, pick "New Inbound". If it's an automated Calendly booking email, pick "Meeting Booked").
- VALUE: [Mentioned budget, team size, e.g., "200 seats", "$5,000", or "Unknown"]
- PAIN_POINT: [What problem are they trying to solve?]
- NEXT_STEPS: [Actionable next step for the sales rep]

Return the output STRICTLY in this JSON-like key-value format exactly:
STATUS: [LEAD | POSSIBLE_LEAD | NOT_LEAD]
REASON: [Short explanation of why]
COMPANY: [Company Name]
PRIORITY: [Priority Level]
LEAD_SOURCE: [Source]
LEAD_STAGE: [Chosen Stage]
VALUE: [Estimated Value or Size]
PAIN_POINT: [Pain Point]
NEXT_STEPS: [Next Steps]
HOOK: [Your Hook]

Subject: RE: LeadLoom Pricing questions
Body: Hey LeadLoom team, Thanks for getting back to me so quickly! Before I pull the trigger on the Pro subscription, I just wanted to ask if the Notion sync has the capability to handle custom relational databases, or if it strictly maps to a single flat table? We have a complex workspace and I'd like to ensure it fits before I migrate our 15 SDRs over. - Sam
"""

try:
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content(prompt)
    print(response.text)
except Exception as e:
    print(e)
