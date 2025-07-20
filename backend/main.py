from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For prod, replace "*" with ["https://gundamwebsite.vercel.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI")

def get_db():
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    return client["gundam_tcg"]

@app.get("/")
def read_root():
    return {"message": "Gundam Backend API is running."}

@app.get("/cards")
def get_cards(name: str = ""):
    db = get_db()
    query = {}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}
    cards = list(db.cards.find(query, {"_id": 0}))
    return {"cards": cards}

@app.get("/card/{card_id}")
def get_card(card_id: str):
    db = get_db()
    card = db.cards.find_one({"id": card_id}, {"_id": 0})
    if card:
        return card
    return {"error": "Card not found"}
