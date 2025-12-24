from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

class CategoryRepository(BaseRepository[Category, CategoryCreate, CategoryUpdate]):
    def get_root_categories(self, db: Session) -> List[Category]:
        return db.query(Category).filter(Category.parent_id == None).all()

    def get_by_slug(self, db: Session, *, slug: str) -> Optional[Category]:
        return db.query(Category).filter(Category.slug == slug).first()

category_repository = CategoryRepository(Category)
