from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.base_class import Base

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Order(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True) # Allow guest checkout
    total_amount = Column(Float, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Shipping info
    shipping_address = Column(String, nullable=False)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("order.id"))
    product_id = Column(Integer, ForeignKey("product.id"))
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Float, nullable=False)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

class ProductInquiry(Base):
    __tablename__ = "product_inquiry"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id"))
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    product = relationship("Product")
