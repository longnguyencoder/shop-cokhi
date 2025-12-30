from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.cart import CartItem
from app.schemas.cart import CartItemCreate, CartItemUpdate

class CartRepository(BaseRepository[CartItem, CartItemCreate, CartItemUpdate]):
    def get_by_user(self, db: Session, *, user_id: int) -> List[CartItem]:
        return db.query(CartItem).filter(CartItem.user_id == user_id).all()

    def get_by_user_and_product(self, db: Session, *, user_id: int, product_id: int) -> Optional[CartItem]:
        return db.query(CartItem).filter(
            CartItem.user_id == user_id, 
            CartItem.product_id == product_id
        ).first()

cart_repository = CartRepository(CartItem)
