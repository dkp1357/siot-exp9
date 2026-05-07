from pydantic import BaseModel
from typing import List, Optional

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    face_descriptor: List[float]  # 128-d face embedding from face-api.js

class UserLogin(UserBase):
    face_descriptor: List[float]  # 128-d face embedding from face-api.js

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
