from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()


@app.get("/")
def root():
    return {"message": "It works!"}

@app.post("/api/checkout/search")
async def search(request: Request):
    try:
        body = await request.json()
        print('Search API - Request body:', body)
        print("--~--~-")

        engine = body.get("engine")
        amazon_domain = body.get("amazon_domain")
        asin = body.get("asin")
        q = body.get("q")

        if not engine or not amazon_domain:
            raise HTTPException(status_code=400, detail="Missing required parameters")

        API_KEY = os.getenv("SEARCH_API_KEY")
        if not API_KEY:
            print('Search API - API key not configured')
            raise HTTPException(status_code=500, detail="API key not configured")

        # # Build the base URL
        # if asin:
        #     endpoint = (
        #         f"https://www.searchapi.io/api/v1/search?"
        #         f"engine=amazon_product&amazon_domain={amazon_domain}&asin={asin}"
        #     )
        # elif q:
        #     endpoint = (
        #         f"https://www.searchapi.io/api/v1/search?"
        #         f"engine=amazon_search&amazon_domain={amazon_domain}&q={httpx.QueryParams({'q': q})['q']}"
        #     )
        # else:
        #     raise HTTPException(status_code=400, detail="Either asin or search query (q) is required")

        # print('Search API - Making request to:', endpoint)

        # async with httpx.AsyncClient() as client:
        #     response = await client.get(endpoint, headers={
        #         "Authorization": f"Bearer {API_KEY}",
        #         "Content-Type": "application/json"
        #     })

        base_url = "https://www.searchapi.io/api/v1/search"
        params = {
            "engine": "amazon_product" if asin else "amazon_search",
            "amazon_domain": amazon_domain,
            # Add num parameter only for search queries
            **({"asin": asin} if asin else {"q": q, "num": 1})
        }

        print('Making request to:', base_url, 'with params:', params)

        async with httpx.AsyncClient() as client:
            response = await client.get(
                base_url,
                params=params,
                headers={"Authorization": f"Bearer {API_KEY}"}
            )

        print('Search API - Response status:', response.status_code)
        response_text = response.text
        print('Search API - Response text:', response_text)

        try:
            data = response.json()
            print('Search API - Parsed response:', data)
        except Exception as e:
            print('Search API - Failed to parse response:', e)
            raise HTTPException(status_code=500, detail="Invalid API response format")

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=data.get("error", "Search failed"))

        if asin:
            if not data.get("product") and not (data.get("organic_results") and len(data["organic_results"]) > 0):
                raise HTTPException(status_code=404, detail="Product not found")
            if not data.get("product") and data.get("organic_results"):
                data["product"] = data["organic_results"][0]
        else:
            if not data.get("organic_results"):
                raise HTTPException(status_code=404, detail="No results found")

        return JSONResponse(content=data)

    except Exception as error:
        print('Search API - Error:', error)
        return JSONResponse(status_code=500, content={"error": "Internal server error"})
