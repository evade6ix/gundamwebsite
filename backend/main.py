from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient, errors
import os
import logging

# ✅ Enable detailed logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with ["https://gundamwebsite.vercel.app"] for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    logger.error("❌ MONGO_URI environment variable not set!")
else:
    logger.info(f"✅ MONGO_URI found: {MONGO_URI[:30]}...")

def get_db():
    try:
        logger.debug("🔌 Connecting to MongoDB...")
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        db = client["gundam_tcg"]
        # Test connection
        client.admin.command('ping')
        logger.debug("✅ MongoDB connection successful.")
        return db
    except errors.ServerSelectionTimeoutError as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error connecting to MongoDB: {e}")
        raise

@app.get("/")
def read_root():
    logger.info("📡 GET / called")
    return {"message": "Gundam Backend API is running."}

@app.get("/cards")
def get_cards(name: str = ""):
    logger.info(f"📡 GET /cards called with name={name}")
    try:
        db = get_db()
        query = {}
        if name:
            query["name"] = {"$regex": name, "$options": "i"}
        cards = list(db.cards.find(query, {"_id": 0}))
        logger.debug(f"🔎 Found {len(cards)} cards")
        return {"cards": cards}
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
