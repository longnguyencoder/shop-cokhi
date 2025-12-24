from typing import Optional
from pydantic import BaseModel

class BrandBase(BaseModel):
    name: str
    logo_url: Optional[str] = None
    description: Optional[str] = None

class BrandCreate(BrandBase):
    pass

class BrandUpdate(BrandBase):
    name: Optional[str] = None

class Brand(BrandBase):
    id: int
    
    class Config:
        from_attributes = True
