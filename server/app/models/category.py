from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, backref
from app.db.base_class import Base

class Category(Base):
    __tablename__ = "category"  # Explicit table name
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    image_url = Column(String, nullable=True)
    
    parent_id = Column(Integer, ForeignKey("category.id"), nullable=True)
    children = relationship(
        "Category", 
        backref=backref("parent", remote_side=[id]),
        cascade="all, delete-orphan"
    )
    
    products = relationship("Product", back_populates="category")
