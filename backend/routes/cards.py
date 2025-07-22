from fastapi import APIRouter, Query
from pymongo import MongoClient
import os

router = APIRouter()

# MongoDB connection
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

    # 🔹 Search by name (case-insensitive)
    if name:
        query["name"] = {"$regex": name, "$options": "i"}

    # 🔹 Filter by set(s) - case-insensitive partial match
    if set:
        set_regex = "|".join([f".*{s.strip()}.*" for s in set.split(",")])
        query["set.name"] = {"$regex": set_regex, "$options": "i"}

    # 🔹 Filter by type(s) - case-insensitive partial match
    if type:
        type_regex = "|".join([f".*{t.strip()}.*" for t in type.split(",")])
        query["cardType"] = {"$regex": type_regex, "$options": "i"}

    # 🔹 Filter by rarity(ies) - case-insensitive partial match
    if rarity:
        rarity_regex = "|".join([f".*{r.strip()}.*" for r in rarity.split(",")])
        query["rarity"] = {"$regex": rarity_regex, "$options": "i"}

    # 🔹 Pagination & sorting
    total = cards_collection.count_documents(query)
    cards = (
        cards_collection.find(query, {"_id": 0})
        .sort("name", 1)  # sort alphabetically
        .skip((page - 1) * limit)
        .limit(limit)
    )

    return {
        "cards": list(cards),
        "page": page,
        "totalPages": (total + limit - 1) // limit
    }
