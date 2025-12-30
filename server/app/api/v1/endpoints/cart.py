from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models
from app.api import deps
from app.repositories.cart_repository import cart_repository
from app.core import socket_manager # Import

router = APIRouter()

@router.get("/", response_model=List[schemas.cart.CartItem])
def get_cart(
    db: Session = Depends(deps.get_db),
    current_user: models.user.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get current user's cart.
    """
    return cart_repository.get_by_user(db, user_id=current_user.id)

@router.post("/", response_model=schemas.cart.CartItem)
async def add_to_cart(
    *,
    db: Session = Depends(deps.get_db),
    cart_in: schemas.cart.CartItemCreate,
    current_user: models.user.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Add item to cart or update quantity if exists.
    """
    existing_item = cart_repository.get_by_user_and_product(
        db, user_id=current_user.id, product_id=cart_in.product_id
    )
    if existing_item:
        item = cart_repository.update(
            db, db_obj=existing_item, obj_in={"quantity": existing_item.quantity + cart_in.quantity}
        )
        await socket_manager.emit_to_all('cart_updated', {'user_id': current_user.id})
        return item
    
    # Create new item
    db_obj = models.cart.CartItem(
        user_id=current_user.id,
        product_id=cart_in.product_id,
        quantity=cart_in.quantity
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    await socket_manager.emit_to_all('cart_updated', {'user_id': current_user.id})
    return db_obj

@router.put("/{product_id}", response_model=schemas.cart.CartItem)
async def update_cart_item(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    cart_in: schemas.cart.CartItemUpdate,
    current_user: models.user.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Update cart item quantity.
    """
    item = cart_repository.get_by_user_and_product(
        db, user_id=current_user.id, product_id=product_id
    )
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    updated_item = cart_repository.update(db, db_obj=item, obj_in=cart_in)
    await socket_manager.emit_to_all('cart_updated', {'user_id': current_user.id})
    return updated_item

@router.delete("/{product_id}")
async def remove_from_cart(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    current_user: models.user.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Remove item from cart.
    """
    item = cart_repository.get_by_user_and_product(
        db, user_id=current_user.id, product_id=product_id
    )
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    db.delete(item)
    db.commit()
    await socket_manager.emit_to_all('cart_updated', {'user_id': current_user.id})
    return {"message": "Item removed from cart"}

@router.delete("/")
async def clear_cart(
    db: Session = Depends(deps.get_db),
    current_user: models.user.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Clear all items from user's cart.
    """
    items = cart_repository.get_by_user(db, user_id=current_user.id)
    for item in items:
        db.delete(item)
    db.commit()
    await socket_manager.emit_to_all('cart_updated', {'user_id': current_user.id})
    return {"message": "Cart cleared"}
