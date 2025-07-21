from fastapi import APIRouter, HTTPException, Depends, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from passlib.hash import bcrypt
from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timedelta
import os, smtplib
from email.mime.text import MIMEText

# Environment variables
JWT_SECRET = os.getenv("JWT_SECRET", "super_secret_jwt_key")
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASS = os.getenv("SMTP_PASS")
MONGO_URI = os.getenv("MONGO_URI")

if not SMTP_EMAIL or not SMTP_PASS or not MONGO_URI:
    raise RuntimeError("❌ Missing environment variables for SMTP or MongoDB!")

router = APIRouter()

# MongoDB
client = MongoClient(MONGO_URI)
db = client["gundam_tcg"]
users_collection = db["users"]

# JWT Settings
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day
RESET_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes


# Pydantic models
class UserRegister(BaseModel):
    name: str = "Anonymous"  # Default to Anonymous if missing
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# Helper functions
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")


def verify_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=400, detail="Invalid token.")
        return email
    except ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired.")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid token.")


# Routes
@router.post("/register")
def register(user: UserRegister):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered.")
    hashed_pw = bcrypt.hash(user.password)
    users_collection.insert_one({
        "name": user.name,  # Save name too
        "email": user.email,
        "password": hashed_pw
    })
    return {"msg": "✅ User registered successfully."}


@router.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not bcrypt.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password.")
    token = create_access_token({"sub": user.email}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer"}


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    user = users_collection.find_one({"email": req.email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found.")

    reset_token = create_access_token({"sub": req.email}, timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES))
    reset_link = f"https://gundamwebsite.vercel.app/reset-password?token={reset_token}"

    # Send Email
    message = MIMEText(f"Click the link to reset your password:\n\n{reset_link}\n\nThis link expires in 30 minutes.")
    message["Subject"] = "Gundam TCG Password Reset"
    message["From"] = SMTP_EMAIL
    message["To"] = req.email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SMTP_EMAIL, SMTP_PASS)
            server.sendmail(SMTP_EMAIL, req.email, message.as_string())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

    return {"msg": "📧 Password reset link sent to your email."}


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest):
    email = verify_token(req.token)
    hashed_pw = bcrypt.hash(req.new_password)
    result = users_collection.update_one({"email": email}, {"$set": {"password": hashed_pw}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"msg": "✅ Password reset successful."}
