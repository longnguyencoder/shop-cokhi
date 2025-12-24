from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.repositories.base import BaseRepository
from app.models.product import Product, ProductSpec
from app.schemas.product import ProductCreate, ProductUpdate

class ProductRepository(BaseRepository[Product, ProductCreate, ProductUpdate]):
    def get_by_slug(self, db: Session, *, slug: str) -> Optional[Product]:
        return db.query(Product).filter(Product.slug == slug).first()

    def search_products(
        self, 
        db: Session, 
        *, 
        query: str, 
        category_id: Optional[int] = None,
        brand_id: Optional[int] = None,
        spec_filters: Optional[dict[str, str]] = None, # e.g. {"Material": "HSS", "Diameter": "10mm"}
        skip: int = 0, 
        limit: int = 100
    ) -> List[Product]:
        db_query = db.query(Product)
        if query:
            db_query = db_query.filter(
                or_(
                    Product.name.ilike(f"%{query}%"),
                    Product.sku.ilike(f"%{query}%"),
                    Product.description.ilike(f"%{query}%")
                )
            )
        if category_id:
            db_query = db_query.filter(Product.category_id == category_id)
        if brand_id:
            db_query = db_query.filter(Product.brand_id == brand_id)
            
        if spec_filters:
            for key, value in spec_filters.items():
                db_query = db_query.join(ProductSpec).filter(
                    ProductSpec.key == key,
                    ProductSpec.value == value
                )
                
        return db_query.offset(skip).limit(limit).all()

    def create_with_specs(
        self, db: Session, *, obj_in: ProductCreate
    ) -> Product:
        obj_in_data = obj_in.model_dump(exclude={"specs"})
        db_obj = Product(**obj_in_data)
        
        for spec_in in obj_in.specs:
            db_obj.specs.append(ProductSpec(**spec_in.model_dump()))
            
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

product_repository = ProductRepository(Product)
