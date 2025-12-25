from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app import schemas, models
from app.api import deps
from app.repositories.brand_repository import brand_repository
import os
import uuid
import shutil

router = APIRouter()

@router.post("/upload-logo")
async def upload_brand_logo(
    file: UploadFile = File(...),
) -> Any:
    """
    Upload a brand logo (generic).
    """
    # Validate file type
    allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: jpg, jpeg, png, gif, webp")
    
    # Create upload directory if not exists
    upload_dir = "static/uploads/brands"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {"logo_url": f"/static/uploads/brands/{unique_filename}"}

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

@router.get("/{brand_id}", response_model=schemas.brand.Brand)
def read_brand(
    *,
    db: Session = Depends(deps.get_db),
    brand_id: int,
) -> Any:
    """
    Get brand by ID.
    """
    brand = brand_repository.get(db, id=brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand

@router.put("/{brand_id}", response_model=schemas.brand.Brand)
def update_brand(
    *,
    db: Session = Depends(deps.get_db),
    brand_id: int,
    brand_in: schemas.brand.BrandUpdate,
    current_user: models.user.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update brand. Admin only.
    """
    brand = brand_repository.get(db, id=brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    brand = brand_repository.update(db, db_obj=brand, obj_in=brand_in)
    return brand

@router.delete("/{brand_id}", response_model=schemas.brand.Brand)
def delete_brand(
    *,
    db: Session = Depends(deps.get_db),
    brand_id: int,
    current_user: models.user.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete brand. Admin only.
    """
    brand = brand_repository.get(db, id=brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    brand = brand_repository.remove(db, id=brand_id)
    return brand

@router.post("/{brand_id}/upload-image", response_model=schemas.brand.Brand)
def upload_brand_image(
    *,
    db: Session = Depends(deps.get_db),
    brand_id: int,
    file: UploadFile = File(...),
    current_user: models.user.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Upload brand logo image. Admin only.
    """
    brand = brand_repository.get(db, id=brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    # Validate file type
    allowed_extensions = {'jpg', 'jpeg', 'png', 'gif', 'webp'}
    file_ext = file.filename.split('.')[-1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: jpg, jpeg, png, gif, webp")
    
    # Create upload directory if not exists
    upload_dir = "static/uploads/brands"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
    
    # Update brand logo_url
    logo_url = f"/static/uploads/brands/{unique_filename}"
    brand = brand_repository.update(db, db_obj=brand, obj_in={"logo_url": logo_url})
    
    return brand
