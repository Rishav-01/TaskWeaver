from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pwdlib import PasswordHash
from pymongo.errors import DuplicateKeyError
from models.User import User, UserInDB
from services.index import get_user_by_email
from db.config import db
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Use passlib.CryptContext directly for more control
pwd_context = PasswordHash.recommended()

def get_password_hash(password: str) -> str:
    """
    Hashes a password.
    """
    return pwd_context.hash(password)

def create_user(user: User):
    """Hashes the user's password and saves them to the database."""
    try:
        # Hash the password directly here
        hashed_password = get_password_hash(user.password)
        user_in_db = UserInDB(**user.model_dump(), hashed_password=hashed_password)
        
        # Pydantic v2 uses model_dump() instead of dict()
        user_dict = user_in_db.model_dump()
        # The UserInDB model has 'hashed_password', but the DB expects 'password'
        user_dict['password'] = user_dict.pop('hashed_password')
        
        result = db.User.insert_one(user_dict)
        
        # Prepare the response object, excluding the password
        user_dict.pop("password")
        user_dict["id"] = str(result.inserted_id)
        user_dict.pop("_id", None)
        return {"message": "User created successfully", "user": user_dict}
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
    except JWTError: # Catches errors from python-jose
        raise credentials_exception

    user = get_user_by_email(email=email)
    if user is None:
        raise credentials_exception
    
    # Pydantic v2 requires a dictionary for model_validate
    user_dict = dict(user)
    user_dict.pop('_id', None) # Remove ObjectId before validation
    return User.model_validate(user_dict)