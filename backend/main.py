from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace "*" with ["https://gundamwebsite.vercel.app"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["gundam_tcg"]
cards_collection = db["cards"]

@app.get("/")
def read_root():
    return {"message": "Gundam Backend API is running."}

@app.get("/cards")
def get_cards(name: str = ""):
    query = {}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}
    cards = list(cards_collection.find(query, {"_id": 0}))
    return {"cards": cards}

@app.get("/card/{card_id}")
def get_card(card_id: str):
    card = cards_collection.find_one({"id": card_id}, {"_id": 0})
    if card:
        return card
    return {"error": "Card not found"}
