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
    query = {}

    # 🔹 Search by name (case-insensitive partial match)
    if name:
        query["name"] = {"$regex": name, "$options": "i"}

    # 🔹 Filter by set(s)
    if set:
        query["set.name"] = {"$in": set.split(",")}

    # 🔹 Filter by type(s)
    if type:
        query["cardType"] = {"$in": type.split(",")}

    # 🔹 Filter by rarity(ies)
    if rarity:
        query["rarity"] = {"$in": rarity.split(",")}

    # 🔹 Get total count for pagination
    total = cards_collection.count_documents(query)

    # 🔹 Fetch paginated, sorted results
    cards = (
        cards_collection.find(query, {"_id": 0})
        .sort("name", 1)  # sort alphabetically by name
        .skip((page - 1) * limit)
        .limit(limit)
    )

    return {
        "cards": list(cards),
        "page": page,
        "totalPages": (total + limit - 1) // limit
    }
