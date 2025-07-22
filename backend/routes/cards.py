from fastapi import APIRouter
from pymongo import MongoClient
import os

router = APIRouter()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["gundam_tcg"]
cards_collection = db["cards"]

@router.get("/filters")
def get_filters():
    sets = cards_collection.distinct("set.name")
    types = cards_collection.distinct("cardType")
    rarities = cards_collection.distinct("rarity")
    return {
        "sets": sorted([s for s in sets if s]),
        "types": sorted([t for t in types if t]),
        "rarities": sorted([r for r in rarities if r]),
    }

@router.get("/cards")
def get_cards(name: str = "", page: int = 1, limit: int = 20):
    query = {"name": {"$regex": name, "$options": "i"}} if name else {}
    total = cards_collection.count_documents(query)
    cards = list(cards_collection.find(query, {"_id": 0})
                 .skip((page - 1) * limit)
                 .limit(limit))
    return {
        "cards": cards,
        "page": page,
        "totalPages": (total + limit - 1) // limit
    }
