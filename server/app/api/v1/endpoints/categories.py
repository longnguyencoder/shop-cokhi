from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.api import deps
from app.repositories.category_repository import category_repository

router = APIRouter()

@router.get("/", response_model=List[schemas.category.CategoryWithChildren])
def read_categories(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve categories (root level with children).
    """
    categories = category_repository.get_root_categories(db)
    return categories

@router.post("/", response_model=schemas.category.Category)
def create_category(
    *,
    db: Session = Depends(deps.get_db),
    category_in: schemas.category.CategoryCreate,
) -> Any:
    """
    Create new category.
    """
    category = category_repository.get_by_slug(db, slug=category_in.slug)
    if category:
        raise HTTPException(
            status_code=400,
            detail="Category with this slug already exists.",
        )
    
    if category_in.parent_id is not None:
        if category_in.parent_id == 0:
             raise HTTPException(
                status_code=400,
                detail="Parent ID cannot be 0. Use null (None) for root categories.",
            )
        parent = category_repository.get(db, id=category_in.parent_id)
        if not parent:
            raise HTTPException(
                status_code=400,
                detail=f"Parent category with ID {category_in.parent_id} does not exist.",
            )

    category = category_repository.create(db, obj_in=category_in)
    return category

@router.get("/{category_id}", response_model=schemas.category.Category)
def read_category(
    category_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get category by ID.
    """
    category = category_repository.get(db, id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.put("/{category_id}", response_model=schemas.category.Category)
def update_category(
    *,
    db: Session = Depends(deps.get_db),
    category_id: int,
    category_in: schemas.category.CategoryUpdate,
) -> Any:
    """
    Update a category.
    """
    category = category_repository.get(db, id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category = category_repository.update(db, db_obj=category, obj_in=category_in)
    return category

@router.delete("/{category_id}", response_model=schemas.category.Category)
def delete_category(
    *,
    db: Session = Depends(deps.get_db),
    category_id: int,
) -> Any:
    """
    Delete a category.
    """
    category = category_repository.get(db, id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category = category_repository.remove(db, id=category_id)
    return category
