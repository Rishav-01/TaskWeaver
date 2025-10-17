from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    email: EmailStr
    password: str

class UserInDB(User):
    hashed_password: str