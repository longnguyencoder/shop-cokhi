from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Brand(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    logo_url = Column(String)
    description = Column(Text)
    
    products = relationship("Product", back_populates="brand")

class Product(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    sku = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=True) # None means "Contact for quote"
    in_stock = Column(Boolean(), default=True)
    image_url = Column(String, nullable=True)
    
    category_id = Column(Integer, ForeignKey("category.id"), nullable=False)
    brand_id = Column(Integer, ForeignKey("brand.id"), nullable=False)
    
    # Technical Specifications
    diameter = Column(String, nullable=True)  # Đường kính (mm)
    length = Column(String, nullable=True)    # Chiều dài (mm)
    material = Column(String, nullable=True)  # Vật liệu
    flutes = Column(String, nullable=True)    # Số răng
    hardness = Column(String, nullable=True)  # Độ cứng (HRC)
    coating = Column(String, nullable=True)   # Lớp phủ
    
    # Promotion and Timestamps
    on_sale = Column(Boolean, default=False)
    sale_price = Column(Float, nullable=True)
    created_at = Column(String, nullable=True)  # Using String for simplicity
    
    category = relationship("Category", back_populates="products")
    brand = relationship("Brand", back_populates="products")
    specs = relationship("ProductSpec", back_populates="product", cascade="all, delete-orphan")

class ProductSpec(Base):
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id"))
    key = Column(String, index=True) # e.g., "Size", "Material", "Coating"
    value = Column(String)
    
    product = relationship("Product", back_populates="specs")
