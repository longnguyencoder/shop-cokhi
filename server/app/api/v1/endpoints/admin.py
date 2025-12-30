from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models
from app.api import deps
from app.models.order import Order, OrderStatus
from app.repositories.order_repository import order_repository

router = APIRouter()

@router.get("/orders", response_model=List[schemas.order.Order])
def get_orders(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.user.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve all orders. Only for superusers.
    """
    orders = db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders

@router.put("/orders/{order_id}/status", response_model=schemas.order.Order)
def update_order_status(
    *,
    db: Session = Depends(deps.get_db),
    order_id: int,
    status: OrderStatus,
    current_user: models.user.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update order status. Only for superusers.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
