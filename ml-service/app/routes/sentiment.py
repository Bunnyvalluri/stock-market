from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.firecrawl_agent import FirecrawlFinancialAgent

router = APIRouter()
agent = FirecrawlFinancialAgent()

class ScrapeRequest(BaseModel):
    url: str

@router.post("/scrape")
async def analyze_sentiment(req: ScrapeRequest):
    """
    POST /sentiment/scrape
    Takes a URL and returns LLM-ready markdown using Firecrawl.
    """
    if not req.url:
        raise HTTPException(status_code=400, detail="URL is required")
        
    try:
        result = await agent.scrape_and_analyze(req.url)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
