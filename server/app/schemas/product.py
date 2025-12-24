from typing import List, Optional
from pydantic import BaseModel

class ProductSpecBase(BaseModel):
    key: str
    value: str

class ProductSpecCreate(ProductSpecBase):
    pass

class ProductSpec(ProductSpecBase):
    id: int
    
    class Config:
        from_attributes = True

# Nested schemas for Category and Brand in Product response
class CategoryInProduct(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True

class BrandInProduct(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    sku: str
    slug: str
    description: Optional[str] = None
    price: Optional[float] = None
    in_stock: bool = True
    category_id: int
    brand_id: int
    image_url: Optional[str] = None
    
    # Technical Specifications
    diameter: Optional[str] = None
    length: Optional[str] = None
    material: Optional[str] = None
    flutes: Optional[str] = None
    hardness: Optional[str] = None
    coating: Optional[str] = None
    
    # Promotion and Timestamps
    on_sale: Optional[bool] = False
    sale_price: Optional[float] = None
    created_at: Optional[str] = None

class ProductCreate(ProductBase):
    specs: List[ProductSpecCreate] = []

class ProductUpdate(ProductBase):
    name: Optional[str] = None
    sku: Optional[str] = None
    category_id: Optional[int] = None
    brand_id: Optional[int] = None

class Product(ProductBase):
    id: int
    specs: List[ProductSpec] = []
    category: Optional[CategoryInProduct] = None
    brand: Optional[BrandInProduct] = None
    
    class Config:
        from_attributes = True
