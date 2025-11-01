from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status, APIRouter, Request
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pymongo.errors import DuplicateKeyError
from models.User import User, UserInDB
from services.index import get_user_by_email
from schemas.index import CreatedUserResponse
from db.config import user_collection
from dotenv import load_dotenv
import os
from httpx_oauth.clients.google import GoogleOAuth2
import secrets

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL")
google_client = GoogleOAuth2(client_id=GOOGLE_CLIENT_ID, client_secret=GOOGLE_CLIENT_SECRET)
auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.get("/google/login")
async def login_google(request: Request):
    """Redirects the user to Google's OAuth 2.0 login page."""
    redirect_uri = request.url_for("auth_google_callback")
    return await google_client.get_authorization_url(redirect_uri, scope=["email", "profile"])

@auth_router.get("/google/callback")
async def auth_google_callback(request: Request, code: str):
    """Handles the callback from google after user authentication"""
    print("Received code:", code)
    try:
        token_data = await google_client.get_access_token(code, request.url_for("auth_google_callback"))
        user_data = await google_client.get_user_info(token_data["access_token"])
        user_email = user_data["email"]

        # Check if user exists in the database
        db_user = get_user_by_email(email=user_email)

        if not db_user:
            new_user = User(
                email=user_email,
                first_name=user_data.get("given_name", ""),
                last_name=user_data.get("family_name", ""),
                password=secrets.token_urlsafe(16)  # Generate a random password
            )
            created_user = create_user(new_user)
            user_id_for_token =  created_user["id"]
        else:
            user_id_for_token = str(db_user["_id"])

        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_email}, expires_delta=access_token_expires
        )
        
        # Redirect user to frontend with token
        response = RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?token={access_token}")
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")



pwd_context = PasswordHash.recommended()

def get_password_hash(password: str) -> str:
    """
    Hashes a password.
    """
    return pwd_context.hash(password)

def create_user(user: User) -> CreatedUserResponse:
    """Hashes the user's password and saves them to the database."""
    try:
        # Check if this email is already registered
        existing_user = user_collection.find_one({"email": user.email})
        if existing_user:
            raise DuplicateKeyError(error="Email already registered")

        # Hash the password directly here
        hashed_password = get_password_hash(user.password)
        user_in_db = UserInDB(**user.model_dump(), hashed_password=hashed_password)
        
        # Pydantic v2 uses model_dump() instead of dict()
        user_dict = user_in_db.model_dump()
        # The UserInDB model has 'hashed_password', but the DB expects 'password'
        user_dict['password'] = user_dict.pop('hashed_password')
        
        result = user_collection.insert_one(user_dict)
        
        # Prepare the response object, excluding the password
        user_dict.pop("password")
        user_dict["id"] = str(result.inserted_id)
        user_dict.pop("_id", None)
        return user_dict
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during user creation: {e}")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a hashed one."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Creates a new JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Decodes token and returns the current user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception

    user = get_user_by_email(email=email)
    if user is None:
        raise credentials_exception
    
    # Pydantic v2 requires a dictionary for model_validate
    user_dict = dict(user)
    user_dict.pop('_id', None) # Remove ObjectId before validation
    return User.model_validate(user_dict)