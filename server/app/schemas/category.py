from typing import List, Optional
from pydantic import BaseModel

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[int] = None
    image_url: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    name: Optional[str] = None
    slug: Optional[str] = None

class Category(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True

class CategoryWithChildren(Category):
    children: List["CategoryWithChildren"] = []

CategoryWithChildren.model_rebuild()
