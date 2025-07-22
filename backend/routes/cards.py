from fastapi import APIRouter, Query
from pymongo import MongoClient
import os

router = APIRouter()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["gundam_tcg"]
cards_collection = db["cards"]

@router.get("/cards")
def get_cards(
    name: str = "",
    set: str = Query(None),       # comma-separated sets
    type: str = Query(None),      # comma-separated types
    rarity: str = Query(None),    # comma-separated rarities
    page: int = 1,
    limit: int = 20
):
    # 🔹 Build MongoDB query
    query = {}

    if name:
        query["name"] = {"$regex": name, "$options": "i"}

    if set:
        sets = [s.strip() for s in set.split(",")]
        query["set.name"] = {"$in": sets}

    if type:
        types = [t.strip() for t in type.split(",")]
        query["cardType"] = {"$in": types}

    if rarity:
        rarities = [r.strip() for r in rarity.split(",")]
        query["rarity"] = {"$in": rarities}

    # Debug: log the query
    print("MongoDB Query:", query)

    # 🔹 Get total count
    total = cards_collection.count_documents(query)

    # 🔹 Fetch paginated & sorted results
    cards = (
        cards_collection.find(query, {"_id": 0})
        .sort("name", 1)
        .skip((page - 1) * limit)
        .limit(limit)
    )

    return {
        "cards": list(cards),
        "page": page,
        "totalPages": (total + limit - 1) // limit
    }
