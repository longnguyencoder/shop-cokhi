from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from app.schemas.product import Product

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItem(CartItemBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    product: Product

    class Config:
        from_attributes = True
