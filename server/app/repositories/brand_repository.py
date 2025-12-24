from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.product import Brand
from app.schemas.brand import BrandCreate, BrandUpdate

class BrandRepository(BaseRepository[Brand, BrandCreate, BrandUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Brand]:
        return db.query(Brand).filter(Brand.name == name).first()

brand_repository = BrandRepository(Brand)
