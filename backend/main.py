from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient, errors
from routes import auth
import os
import logging

# ✅ Enable detailed logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production replace * with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Authorization"],  # Allow exposing JWT token
)


MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    logger.error("❌ MONGO_URI environment variable not set!")
else:
    logger.info(f"✅ MONGO_URI found: {MONGO_URI[:30]}...")

# ✅ Lazy MongoDB connection
def get_db():
    try:
        logger.debug("🔌 Initializing MongoDB client (lazy)...")
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, connect=False)
        db = client["gundam_tcg"]
        logger.debug("✅ MongoDB client initialized (lazy)")
        return db
    except errors.ServerSelectionTimeoutError as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error initializing MongoDB: {e}")
        raise

@app.get("/")
def read_root():
    logger.info("📡 GET / called")
    return {"message": "Gundam Backend API is running."}

from fastapi import Request

@app.get("/cards")
def get_cards(request: Request, name: str = ""):
    logger.info(f"📡 GET /cards called with name={name}")
    try:
        db = get_db()
        query = {}
        if name:
            query["name"] = {"$regex": name, "$options": "i"}

        # Pagination params
        page = int(request.query_params.get("page", 1))
        limit = int(request.query_params.get("limit", 30))
        skip = (page - 1) * limit

        total = db.cards.count_documents(query)
        cards_cursor = db.cards.find(query, {"_id": 0}).skip(skip).limit(limit)
        cards = list(cards_cursor)

        # Flatten image URL
        for card in cards:
            if "images" in card and "small" in card["images"]:
                card["image_url"] = card["images"]["small"]

        logger.debug(f"🔎 Page {page}/{(total + limit - 1) // limit} - Found {len(cards)} cards")
        return {
            "cards": cards,
            "total": total,
            "page": page,
            "totalPages": (total + limit - 1) // limit
        }
    except Exception as e:
        logger.error(f"❌ Error in /cards: {e}")
        return {"error": str(e)}


@app.get("/card/{card_id}")
def get_card(card_id: str):
    logger.info(f"📡 GET /card/{card_id} called")
    try:
        db = get_db()
        card = db.cards.find_one({"id": card_id}, {"_id": 0})
        if card:
            logger.debug("✅ Card found")
            return card
        logger.warning("⚠️ Card not found")
        return {"error": "Card not found"}
    except Exception as e:
        logger.error(f"❌ Error in /card/{card_id}: {e}")
        return {"error": str(e)}

@app.get("/health")
def health():
    logger.info("💚 Health check passed")
    return {"status": "ok"}

app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.get("/filters")
def get_filters():
    logger.info("📡 GET /filters called")
    try:
        db = get_db()
        sets = db.cards.distinct("set.name")
        types = db.cards.distinct("cardType")
        rarities = db.cards.distinct("rarity")

        logger.debug(f"✅ Found {len(sets)} sets, {len(types)} types, {len(rarities)} rarities")
        return {
            "sets": sorted(filter(None, sets)),      # Remove None and sort
            "types": sorted(filter(None, types)),
            "rarities": sorted(filter(None, rarities)),
        }
    except Exception as e:
        logger.error(f"❌ Error in /filters: {e}")
        return {"error": str(e)}
