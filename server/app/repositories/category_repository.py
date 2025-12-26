from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

from sqlalchemy import func
from app.models.product import Product

class CategoryRepository(BaseRepository[Category, CategoryCreate, CategoryUpdate]):
    def get_root_categories(self, db: Session) -> List[Category]:
        # Get counts for all categories
        counts = dict(
            db.query(Product.category_id, func.count(Product.id))
            .group_by(Product.category_id)
            .all()
        )
        
        roots = db.query(Category).filter(Category.parent_id == None).all()
        
        # Recursive helper to set product_count
        def set_counts(cat):
            cat.product_count = counts.get(cat.id, 0)
            for child in cat.children:
                set_counts(child)
        
        for root in roots:
            set_counts(root)
            
        return roots

    def get_all_flat_with_counts(self, db: Session) -> List[Category]:
        counts = dict(
            db.query(Product.category_id, func.count(Product.id))
            .group_by(Product.category_id)
            .all()
        )
        categories = db.query(Category).all()
        for cat in categories:
            cat.product_count = counts.get(cat.id, 0)
        return categories

    def get_by_slug(self, db: Session, *, slug: str) -> Optional[Category]:
        return db.query(Category).filter(Category.slug == slug).first()

category_repository = CategoryRepository(Category)
