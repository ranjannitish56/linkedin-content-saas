from fastapi import FastAPI, HTTPException
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

# Storage path for local testing (in production we'd use Supabase Storage)
STATIC_DIR = "static_images"
os.makedirs(STATIC_DIR, exist_ok=True)

class BrandProfile(BaseModel):
    company_name: str
    founder_name: Optional[str] = None
    origin_story: Optional[str] = None
    dirty_secret: Optional[str] = None
    contrarian_belief: Optional[str] = None
    enemy: Optional[str] = None
    biggest_win: Optional[str] = None
    secret_sauce: Optional[str] = None
    data_dump: Optional[str] = None
    core_tone: str = "Contrarian & Provocative"
    words_to_kill: str = "Delve, Tapestry, Unleash, Synergize"
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

        persona = f"""You are ghostwriting LinkedIn posts for {request.profile.founder_name}, the founder of {request.profile.company_name}.
        
Brand Identity: {request.profile.origin_story}
The Status Quo we fight: {request.profile.enemy}
Our Contrarian Truth: {request.profile.contrarian_belief}
The Industry Dirty Secret: {request.profile.dirty_secret}
Our Edge (Secret Sauce): {request.profile.secret_sauce}

Voice Constraints:
- Tone: {request.profile.core_tone}
- Strict Rule: NEVER use these words: {request.profile.words_to_kill}
- Style: Direct, slightly provocative, grounded in specifics.
- Strategy: {strategy}
"""

        prompt = ChatPromptTemplate.from_messages([
            ("system", persona),
            ("human", f"Write {request.num_posts} distinct LinkedIn posts based on the strategy above.")
        ])

        chain = prompt | llm
        response = chain.invoke({"strategy": strategy})
        
        # Simple parsing logic to turn the string into a list of post objects
        raw_posts = response.content.split("\n\n")
        posts = [{"content": p.strip(), "image_url": None} for p in raw_posts if p.strip()]
        
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
