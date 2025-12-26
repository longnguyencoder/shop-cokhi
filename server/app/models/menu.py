from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Menu(Base):
    __tablename__ = "menus"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)  # e.g., 'main_nav', 'footer_links'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    items = relationship("MenuItem", back_populates="menu", cascade="all, delete-orphan", order_by="MenuItem.sort_order")

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey("menus.id"))
    category_id = Column(Integer, ForeignKey("category.id"), nullable=True) # Link to a category
    custom_title = Column(String, nullable=True) # Override category name or for non-category links (future proofing)
    custom_url = Column(String, nullable=True)   # For external links (future proofing)
    sort_order = Column(Integer, default=0)
    
    menu = relationship("Menu", back_populates="items")
