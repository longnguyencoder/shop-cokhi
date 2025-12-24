from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.api import deps
from app.repositories.brand_repository import brand_repository

router = APIRouter()

@router.get("/", response_model=List[schemas.brand.Brand])
def read_brands(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve brands.
    """
    return brand_repository.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.brand.Brand)
def create_brand(
    *,
    db: Session = Depends(deps.get_db),
    brand_in: schemas.brand.BrandCreate,
) -> Any:
    """
    Create new brand.
    """
    brand = brand_repository.get_by_name(db, name=brand_in.name)
    if brand:
        raise HTTPException(
            status_code=400,
            detail="Brand with this name already exists.",
        )
    return brand_repository.create(db, obj_in=brand_in)
