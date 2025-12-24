from typing import List
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.order import Order, OrderItem, ProductInquiry
from app.schemas.order import OrderCreate, ProductInquiryCreate

class OrderRepository(BaseRepository[Order, OrderCreate, dict]):
    def create_order(self, db: Session, *, obj_in: OrderCreate, user_id: int = None) -> Order:
        db_obj = Order(
            user_id=user_id,
            total_amount=obj_in.total_amount,
            shipping_address=obj_in.shipping_address,
            customer_name=obj_in.customer_name,
            customer_phone=obj_in.customer_phone,
            customer_email=obj_in.customer_email
        )
        
        # In a real app, we would fetch product prices here to verify total_amount
        for item_in in obj_in.items:
            # For simplicity in this scaffold, we'll assume a dummy price
            # Real implementation would look up the product price
            db_obj.items.append(OrderItem(
                product_id=item_in.product_id,
                quantity=item_in.quantity,
                price_at_purchase=0.0 # Placeholder
            ))
            
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

class InquiryRepository(BaseRepository[ProductInquiry, ProductInquiryCreate, dict]):
    pass

order_repository = OrderRepository(Order)
inquiry_repository = InquiryRepository(ProductInquiry)
