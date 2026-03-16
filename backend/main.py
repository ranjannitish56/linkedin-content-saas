from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import uuid
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from visualizer import create_quote_card 
import os
import uvicorn

# Fix for Railway: use the PORT environment variable
PORT = int(os.environ.get("PORT", 8000))

load_dotenv()

app = FastAPI(title="Content SaaS Engine")

# Add CORS Middleware to allow requests from Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, you might want to restrict this to your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Storage path for local testing (in production we'd use Supabase Storage)
STATIC_DIR = "static_images"
os.makedirs(STATIC_DIR, exist_ok=True)

class BrandProfile(BaseModel):
    # Section 1 — Company Overview
    company_name: str
    industry: Optional[str] = None
    company_description: Optional[str] = None
    # Section 2 — Business Scale
    business_size: Optional[str] = None
    markets: Optional[str] = None
    # Section 3 — Target Audience
    target_audience: Optional[str] = None
    decision_makers: Optional[str] = None
    # Section 4 — Products / Services
    products_services: Optional[str] = None
    # Section 5 — Marketing Experience
    marketing_channels: Optional[str] = None
    # Section 6 — Campaign Examples
    campaign_example: Optional[str] = None
    campaign_outcome: Optional[str] = None
    # Section 7-8 — Mistakes & What Works
    industry_mistakes: Optional[str] = None
    what_works: Optional[str] = None
    # Section 9-10 — POV
    unique_perspective: Optional[str] = None
    misunderstood: Optional[str] = None
    # Section 11-12 — Guardrails & Philosophy
    ai_guardrails: Optional[str] = None
    brand_philosophy: Optional[str] = None
    # Section 13-15 — Tone & Competitive Advantage
    content_tone: Optional[str] = None
    content_inspiration: Optional[str] = None
    competitive_advantage: Optional[str] = None
    # Legacy fields (kept for backwards compatibility)
    founder_name: Optional[str] = None
    origin_story: Optional[str] = None
    dirty_secret: Optional[str] = None
    contrarian_belief: Optional[str] = None
    enemy: Optional[str] = None
    biggest_win: Optional[str] = None
    secret_sauce: Optional[str] = None
    data_dump: Optional[str] = None
    core_tone: Optional[str] = None
    words_to_kill: Optional[str] = None
    primary_audience: Optional[str] = None

class GenerationRequest(BaseModel):
    profile: BrandProfile
    count: int = 5
    strategy_manual: Optional[str] = None

class VisualRequest(BaseModel):
    text: str
    author_name: str = "Nitish Ranjan"
    author_title: str = "Founder, Youthfluence"

@app.get("/")
async def root():
    return {"status": "online", "message": "Content SaaS Engine is running"}

@app.post("/generate")
async def generate_posts(request: GenerationRequest):
    try:
        strategy = request.strategy_manual
        if not strategy:
            if os.path.exists("../strategy_manual.md"):
                with open("../strategy_manual.md", "r") as f:
                    strategy = f.read()
            else:
                strategy = "General LinkedIn growth strategy."

        llm = ChatOpenAI(model="gpt-4o", temperature=0.6)

        persona = f"""You are a LinkedIn ghostwriter for a brand called {request.profile.company_name}.

== COMPANY CONTEXT ==
Industry: {request.profile.industry or 'Not specified'}
What they do: {request.profile.company_description or 'Not specified'}
Business size: {request.profile.business_size or 'Not specified'}
Markets: {request.profile.markets or 'Not specified'}
Products/Services: {request.profile.products_services or 'Not specified'}

== TARGET AUDIENCE ==
Primary audience: {request.profile.target_audience or 'Not specified'}
Decision makers: {request.profile.decision_makers or 'Not specified'}

== MARKETING EXPERIENCE ==
Marketing channels used: {request.profile.marketing_channels or 'Not specified'}
Campaign example: {request.profile.campaign_example or 'Not specified'}
Campaign outcome: {request.profile.campaign_outcome or 'Not specified'}

== UNIQUE PERSPECTIVE & POV ==
What we believe differently: {request.profile.unique_perspective or 'Not specified'}
Industry misunderstanding we challenge: Most people misunderstand our industry because {request.profile.misunderstood or 'unknown reasons'}.
Common mistakes we see: {request.profile.industry_mistakes or 'Not specified'}
What actually works: {request.profile.what_works or 'Not specified'}

== BRAND VOICE ==
Brand philosophy: {request.profile.brand_philosophy or 'Not specified'}
Content tone: {request.profile.content_tone or 'Insightful, Tactical'}
Content inspiration: {request.profile.content_inspiration or 'Not specified'}
Competitive advantage: {request.profile.competitive_advantage or 'Not specified'}

== GUARDRAILS (STRICT) ==
NEVER say or do the following: {request.profile.ai_guardrails or 'Do not fabricate statistics. Do not sound promotional.'}

== WRITING RULES ==
- Write in first person from the brand's point of view
- Be specific, not generic  
- Lead with a strong hook on the first line
- Each post should stand alone and feel complete
- Use short paragraphs (1-3 lines max)
- Do NOT use bullet points, hashtags, or emojis
- Separate each post with "---"
"""

        prompt = ChatPromptTemplate.from_messages([
            ("system", persona),
            ("human", f"Write {request.count} distinct LinkedIn posts based on the strategy above.")
        ])

        chain = prompt | llm
        response = chain.invoke({"strategy": strategy})
        
        # Robust parsing: split on numbered sections or double newlines
        raw_text = response.content
        
        # Try to split by numbered post markers first (e.g. "Post 1:", "1.", "---")
        import re
        sections = re.split(r'\n---+\n|\n#{1,3}\s|\nPost \d+:|\n\d+\.\s', raw_text)
        
        # If splitting by markers didn't work well, fall back to double newline  
        if len(sections) <= 1:
            sections = raw_text.split('\n\n')
        
        # Filter: only keep posts that have meaningful content (more than 50 chars)
        posts = [
            {"content": p.strip(), "image_url": None} 
            for p in sections 
            if len(p.strip()) > 50
        ]
        
        return {
            "success": True,
            "posts": posts[:request.count]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/visualize")
async def visualize_quote(request: VisualRequest):
    try:
        filename = f"{uuid.uuid4()}.png"
        output_path = os.path.join(STATIC_DIR, filename)
        
        create_quote_card(
            text=request.text,
            author_name=request.author_name,
            author_title=request.author_title,
            output_path=output_path
        )
        
        return {
            "success": True,
            "image_url": f"/static/{filename}",
            "local_path": output_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)
