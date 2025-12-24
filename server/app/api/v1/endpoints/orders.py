from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.api import deps
from app.repositories.order_repository import order_repository, inquiry_repository

router = APIRouter()

@router.post("/", response_model=schemas.order.Order)
def create_order(
    *,
    db: Session = Depends(deps.get_db),
    order_in: schemas.order.OrderCreate,
) -> Any:
    """
    Create a new order.
    """
    return order_repository.create_order(db, obj_in=order_in)

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
