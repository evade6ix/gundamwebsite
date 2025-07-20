from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# ✅ Bulletproof CORS for Firefox + any browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 You can replace "*" with ["https://gundamwebsite.vercel.app"] for strict prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],  # 🔥 Expose all headers (fixes weird Firefox behavior)
    max_age=86400          # 🔥 Cache preflight for 1 day
)

API_URL = "https://apitcg.com/api/gundam/cards"
API_KEY = "b941302cb29e78e0f72f2e944546349d7e65727a5791ea2ee84815d6a1820bce"

@app.get("/")
def read_root():
    return {"message": "Gundam Backend API is running."}

@app.get("/cards")
def get_cards(name: str = "", limit: int = 25, page: int = 1):
    params = {
        "name": name,
        "limit": limit,
        "page": page
    }
    headers = {
        "x-api-key": API_KEY
    }
    try:
        response = requests.get(API_URL, params=params, headers=headers)
        response.raise_for_status()
        api_data = response.json()

        # Reformat data for frontend
        return {
            "cards": [
                {
                    "id": card["id"],
                    "name": card["name"],
                    "image_url": card["images"]["small"],
                    "rarity": card["rarity"],
                    "color": card["color"],
                    "cardType": card["cardType"]
                }
                for card in api_data.get("data", [])
            ]
        }
    except requests.RequestException as e:
        return {"error": str(e)}
