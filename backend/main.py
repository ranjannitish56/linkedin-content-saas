from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import uuid
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from .visualizer import create_quote_card # We will create this file next

load_dotenv()

app = FastAPI(title="Content SaaS Engine")

# Storage path for local testing (in production we'd use Supabase Storage)
STATIC_DIR = "static_images"
os.makedirs(STATIC_DIR, exist_ok=True)

class BrandProfile(BaseModel):
    company_name: str
    mission: str
    target_audience: str
    tone: str

class GenerationRequest(BaseModel):
    brand_profile: BrandProfile
    num_posts: int = 5
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

        persona = f"""You are ghostwriting LinkedIn posts for the founder of {request.brand_profile.company_name}.
        
Business Context: {request.brand_profile.mission}
Target Audience: {request.brand_profile.target_audience}
Tone: {request.brand_profile.tone}

Voice Rules:
- Direct and confident.
- Slightly provocative.
- Grounded in specifics.
- Conversational but intelligent.

{strategy}
"""

        prompt = ChatPromptTemplate.from_messages([
            ("system", persona),
            ("human", f"Write {request.num_posts} distinct LinkedIn posts based on the strategy above.")
        ])

        chain = prompt | llm
        response = chain.invoke({"strategy": strategy})
        
        return {
            "success": True,
            "posts": response.content
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
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
