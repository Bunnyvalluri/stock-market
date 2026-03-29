import os
from firecrawl import FirecrawlApp
import json
from enum import Enum
from pydantic import BaseModel, Field

# Ensure you have FIRECRAWL_API_KEY set in your .env
# You can get a free key from mendable.ai/firecrawl
firecrawl_api_key = os.getenv("FIRECRAWL_API_KEY")

class MarketSentiment(str, Enum):
    BULLISH = "BULLISH"
    BEARISH = "BEARISH"
    NEUTRAL = "NEUTRAL"

class StockAnalysisOutcome(BaseModel):
    sentiment: MarketSentiment = Field(..., description="The overall sentiment regarding the stock or market")
    confidence_score: float = Field(..., description="Confidence score from 0.0 to 1.0 based on the news data extracted")
    key_takeaway: str = Field(..., description="A 1-sentence summary of the news impact on the asset")

class FirecrawlFinancialAgent:
    def __init__(self):
        # Initialize the Firecrawl client
        # This powerful engine bypasses anti-bot systems, renders JS, and outputs pure LLM-ready markdown
        if not firecrawl_api_key:
            print("Warning: FIRECRAWL_API_KEY is missing. Add it to your .env file.")
        
        # Instantiate Firecrawl
        # Use locally hosted Firecrawl if FIRECRAWL_BASE_URL is set, otherwise use cloud
        base_url = os.getenv("FIRECRAWL_BASE_URL")
        if base_url:
            print(f"[*] Firecrawl: Using self-hosted instance at {base_url}")
            self.app = FirecrawlApp(api_key=firecrawl_api_key, api_url=base_url)
        else:
            self.app = FirecrawlApp(api_key=firecrawl_api_key)

    async def scrape_and_analyze(self, url: str) -> dict:
        """
        Takes a raw URL, uses Firecrawl to extract clean LLM-ready markdown,
        and processes it through OpenAI structured output for market sentiment.
        """
        print(f"[*] Firecrawl: Initializing scrape sequence for -> {url}")
        
        try:
            # 1. Engage Firecrawl to scrape the website
            # We use markdown because it's the best format for LLMs to digest
            scrape_result = self.app.scrape_url(
                url, 
                params={
                    'formats': ['markdown'],
                    'waitFor': 2000 # Allow time for charts to render
                }
            )
            
            raw_markdown = scrape_result.get('markdown')
            
            if not raw_markdown:
                return {"error": "Firecrawl could not extract markdown from this URL."}
            
            print(f"[*] Firecrawl Complete: Extracted {len(raw_markdown)} characters.")
            
            # 2. Structured Extraction via OpenAI (GPT-4o)
            # We use the clean markdown Firecrawl gave us and turn it into actionable data
            from openai import OpenAI
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

            print("[*] Firecrawl: Sending markdown to LLM for structured extraction...")
            completion = client.beta.chat.completions.parse(
                model="gpt-4o-2024-08-06",
                messages=[
                    {"role": "system", "content": "You are a professional Wall Street analyst. Extract core financial sentiment and a key takeaway from the provided article markdown."},
                    {"role": "user", "content": f"Analyze this article: \n\n{raw_markdown[:15000]}"} # Limit to 15k chars for safety
                ],
                response_format=StockAnalysisOutcome,
            )
            
            outcome = completion.choices[0].message.parsed
            
            return {
                "status": "success",
                "sentiment": outcome.sentiment,
                "confidence": outcome.confidence_score,
                "takeaway": outcome.key_takeaway,
                "source_url": url,
                "data_preview": raw_markdown[:300]
            }

        except Exception as e:
            print(f"[!] Firecrawl Error: {str(e)}")
            return {"error": str(e)}

    # Optional: Firecrawl can also CRAWL an entire domain (e.g., scrape an entire Investor Relations site)
    async def crawl_investor_relations(self, domain_url: str):
        print(f"[*] Firecrawl: Crawling entire domain {domain_url}")
        crawl_job = self.app.crawl_url(
            domain_url,
            params={
                'limit': 5, # Limit to 5 pages for testing
                'scrapeOptions': {'formats': ['markdown']}
            }
        )
        return crawl_job

# Usage Example:
# if __name__ == "__main__":
#     agent = FirecrawlFinancialAgent()
#     import asyncio
#     # Turn a noisy Yahoo Finance page into clean LLM data
#     asyncio.run(agent.scrape_and_analyze("https://finance.yahoo.com/news/stock-market-news-today-latest-updates.html"))
