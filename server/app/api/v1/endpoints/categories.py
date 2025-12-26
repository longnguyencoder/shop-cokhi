from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app import schemas
from app.api import deps
from app.repositories.category_repository import category_repository

import os
import uuid
import shutil
from pathlib import Path

router = APIRouter()

@router.post("/upload-image")
async def upload_category_image_generic(
    file: UploadFile = File(...),
) -> Any:
    """
    Upload a category image (generic).
    """
    # Validate file type
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: jpg, jpeg, png, gif, webp")
    
    # Generate unique filename
    upload_dir = Path("static/uploads/categories")
    upload_dir.mkdir(parents=True, exist_ok=True)
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = upload_dir / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"image_url": f"/static/uploads/categories/{unique_filename}"}

@router.get("/", response_model=List[schemas.category.CategoryWithChildren])
def read_categories(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    flat: bool = False,
) -> Any:
    """
    Retrieve categories.
    If flat=True, returns all categories in a flat list.
    Otherwise, returns root level categories with children.
    """
    if flat:
        categories = category_repository.get_all_flat_with_counts(db)
        return categories
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

@router.post("/{category_id}/upload-image")
async def upload_category_image(
    category_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Upload image for a category.
    """
    import os
    import uuid
    from pathlib import Path
    
    category = category_repository.get(db, id=category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Validate file type
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: jpg, jpeg, png, gif, webp")
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    upload_dir = Path("static/uploads/categories")
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Update category with image URL
    image_url = f"/static/uploads/categories/{unique_filename}"
    category = category_repository.update(
        db, db_obj=category, obj_in={"image_url": image_url}
    )
    
    return {"image_url": image_url, "message": "Image uploaded successfully"}
