import requests
from pymongo import MongoClient
import os

API_URL = "https://apitcg.com/api/gundam/cards"
API_KEY = "b941302cb29e78e0f72f2e944546349d7e65727a5791ea2ee84815d6a1820bce"

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["gundam_tcg"]
cards_collection = db["cards"]

def seed_gundam_cards():
    headers = {"x-api-key": API_KEY}
    page = 1
    while True:
        print(f"Fetching page {page}...")
        params = {"limit": 100, "page": page}
        response = requests.get(API_URL, headers=headers, params=params)
        data = response.json()

        if not data.get("data"):
            break

        for card in data["data"]:
            doc = {
                "name": card["name"],
                "image_url": card["images"]["small"],
                "rarity": card["rarity"],
                "color": card["color"],
                "cardType": card["cardType"],
                "effect": card.get("effect", ""),
                "zone": card.get("zone", ""),
                "trait": card.get("trait", ""),
                "ap": card.get("ap", ""),
                "hp": card.get("hp", ""),
                "sourceTitle": card.get("sourceTitle", ""),
            }
            cards_collection.update_one({"name": doc["name"]}, {"$set": doc}, upsert=True)

        if page >= data.get("totalPages", page):
            break
        page += 1

    print("✅ Seeding complete.")

if __name__ == "__main__":
    seed_gundam_cards()
