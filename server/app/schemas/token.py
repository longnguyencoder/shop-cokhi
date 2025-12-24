from typing import Optional, List
from pydantic import BaseModel, EmailStr

class Msg(BaseModel):
    msg: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None

class NewPassword(BaseModel):
    token: str
    new_password: str
