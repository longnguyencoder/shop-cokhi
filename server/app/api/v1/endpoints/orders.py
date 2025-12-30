from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app import schemas
from app.api import deps
from app.repositories.order_repository import order_repository, inquiry_repository
from app.services.email_service import send_new_order_email, send_order_confirmation_email

router = APIRouter()

from app.core import socket_manager # Import
import json
from app.api.deps import get_db # Explicit import for clarity if needed

@router.post("/", response_model=schemas.order.Order)
async def create_order(
    *,
    db: Session = Depends(deps.get_db),
    order_in: schemas.order.OrderCreate,
    background_tasks: BackgroundTasks,
) -> Any:
    """
    Create a new order.
    """
    order = order_repository.create_order(db, obj_in=order_in)
    
    # Send emails in background
    background_tasks.add_task(send_new_order_email, order)
    background_tasks.add_task(send_order_confirmation_email, order)
    
    # Realtime notification
    # We broadcast minimal info or the full order. 
    # Since schemas.order.Order is Pydantic, we can use .dict() or .model_dump()
    # But order is an ORM object here. We rely on Pydantic's from_orm usually.
    # We'll construct a simple dict for notification
    notification_data = {
        "id": order.id,
        "customer_name": order.customer_name,
        "total_amount": order.total_amount,
        "status": order.status,
    }
    await socket_manager.emit_to_all('new_order', notification_data)

    return order

@router.post("/inquiry", response_model=schemas.order.ProductInquiry)
def create_product_inquiry(
    *,
    db: Session = Depends(deps.get_db),
    inquiry_in: schemas.order.ProductInquiryCreate,
) -> Any:
    """
    Create a new product inquiry.
    """
    return inquiry_repository.create(db, obj_in=inquiry_in)
