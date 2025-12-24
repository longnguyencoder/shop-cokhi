from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.order import OrderStatus

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    price_at_purchase: float
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    total_amount: float
    shipping_address: str
    customer_name: str
    customer_phone: str
    customer_email: EmailStr

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    status: OrderStatus
    created_at: datetime
    items: List[OrderItem]
    
    class Config:
        from_attributes = True

class ProductInquiryCreate(BaseModel):
    product_id: int
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    message: Optional[str] = None

class ProductInquiry(ProductInquiryCreate):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
