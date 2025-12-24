from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.product import Product
from app import schemas
from app.api import deps
from app.repositories.product_repository import product_repository
import json

router = APIRouter()

@router.get("/", response_model=List[schemas.product.Product])
def read_products(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    q: Optional[str] = None,
    category_id: Optional[int] = Query(None),
    brand_id: Optional[int] = Query(None),
    on_sale: Optional[bool] = Query(None, description="Filter promotional products"),
    specs_json: Optional[str] = Query(None, description="JSON string of tech specs filtering, e.g. {'Material': 'HSS'}"),
) -> Any:
    """
    Retrieve products with optional filtering.
    """
    spec_filters = None
    if specs_json:
        try:
            spec_filters = json.loads(specs_json)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid specs_json format")
    
    # Build query
    query = db.query(Product)
    
    # Filter by on_sale
    if on_sale is not None:
        query = query.filter(Product.on_sale == on_sale)
    
    # Filter by category
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    # Filter by brand
    if brand_id:
        query = query.filter(Product.brand_id == brand_id)
    
    # Search by name or SKU
    if q:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{q}%"),
                Product.sku.ilike(f"%{q}%")
            )
        )
    
    products = query.offset(skip).limit(limit).all()
    return products

@router.post("/", response_model=schemas.product.Product)
def create_product(
    *,
    db: Session = Depends(deps.get_db),
    product_in: schemas.product.ProductCreate,
) -> Any:
    """
    Create new product with specs.
    """
    product = product_repository.get_by_slug(db, slug=product_in.slug)
    if product:
        raise HTTPException(
            status_code=400,
            detail="Product with this slug already exists.",
        )
    
    # Validation for Category and Brand
    if product_in.category_id == 0:
        raise HTTPException(status_code=400, detail="Category ID cannot be 0.")
    if product_in.brand_id == 0:
        raise HTTPException(status_code=400, detail="Brand ID cannot be 0.")
        
    from app.repositories.category_repository import category_repository
    from app.repositories.brand_repository import brand_repository
    
    category = category_repository.get(db, id=product_in.category_id)
    if not category:
        raise HTTPException(
            status_code=400,
            detail=f"Category with ID {product_in.category_id} does not exist.",
        )
        
    brand = brand_repository.get(db, id=product_in.brand_id)
    if not brand:
        raise HTTPException(
            status_code=400,
            detail=f"Brand with ID {product_in.brand_id} does not exist.",
        )

    product = product_repository.create_with_specs(db, obj_in=product_in)
    return product

@router.get("/{slug}", response_model=schemas.product.Product)
def read_product_by_slug(
    *,
    db: Session = Depends(deps.get_db),
    slug: str,
) -> Any:
    """
    Get product details by slug.
    """
    product = product_repository.get_by_slug(db, slug=slug)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=schemas.product.Product)
def update_product(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    product_in: schemas.product.ProductUpdate,
) -> Any:
    """
    Update a product.
    """
    product = product_repository.get(db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product = product_repository.update(db, db_obj=product, obj_in=product_in)
    return product

@router.delete("/{product_id}", response_model=schemas.product.Product)
def delete_product(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
) -> Any:
    """
    Delete a product.
    """
    product = product_repository.get(db, id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product = product_repository.remove(db, id=product_id)
    return product

@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
) -> Any:
    """
    Upload a product image.
    """
    import os
    import shutil
    import uuid
    
    # Create uploads directory if it doesn't exist
    upload_dir = "static/uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    # Generate unique filename
    extension = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join(upload_dir, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"image_url": f"/static/uploads/{filename}"}
