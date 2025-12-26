from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session, joinedload
from app import schemas
from app.api import deps
from app.models.menu import Menu, MenuItem
from app.models.category import Category

router = APIRouter()

@router.get("/", response_model=List[schemas.menu.Menu])
def read_menus(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve all menus.
    """
    menus = db.query(Menu).offset(skip).limit(limit).all()
    return menus

@router.get("/{code}")
def read_menu_by_code(
    code: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific menu by its code (e.g., 'main_nav').
    Returns menu with items, and category data will be fetched separately by frontend if needed.
    """
    menu = db.query(Menu).filter(Menu.code == code).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found")
    
    # Build response manually to include category data
    menu_dict = {
        "id": menu.id,
        "name": menu.name,
        "code": menu.code,
        "is_active": menu.is_active,
        "created_at": menu.created_at,
        "updated_at": menu.updated_at,
        "items": []
    }
    
    for item in menu.items:
        item_dict = {
            "id": item.id,
            "menu_id": item.menu_id,
            "category_id": item.category_id,
            "custom_title": item.custom_title,
            "custom_url": item.custom_url,
            "sort_order": item.sort_order,
            "category": None
        }
        
        # Fetch category if exists
        if item.category_id:
            category = db.query(Category).filter(Category.id == item.category_id).first()
            if category:
                item_dict["category"] = {
                    "id": category.id,
                    "name": category.name,
                    "slug": category.slug,
                    "description": category.description,
                    "image_url": category.image_url,
                    "parent_id": category.parent_id
                }
        
        menu_dict["items"].append(item_dict)
    
    return menu_dict

@router.post("/", response_model=schemas.menu.Menu)
def create_menu(
    *,
    db: Session = Depends(deps.get_db),
    menu_in: schemas.menu.MenuCreate,
) -> Any:
    """
    Create a new menu.
    """
    menu = db.query(Menu).filter(Menu.code == menu_in.code).first()
    if menu:
        raise HTTPException(status_code=400, detail="Menu with this code already exists")
    
    menu = Menu(**menu_in.dict())
    db.add(menu)
    db.commit()
    db.refresh(menu)
    return menu

@router.put("/{menu_id}", response_model=schemas.menu.Menu)
def update_menu(
    *,
    db: Session = Depends(deps.get_db),
    menu_id: int,
    menu_in: schemas.menu.MenuUpdate,
) -> Any:
    """
    Update a menu (name, code, active status).
    """
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found")
    
    update_data = menu_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(menu, field, value)
    
    db.add(menu)
    db.commit()
    db.refresh(menu)
    return menu

@router.delete("/{menu_id}", response_model=schemas.menu.Menu)
def delete_menu(
    *,
    db: Session = Depends(deps.get_db),
    menu_id: int,
) -> Any:
    """
    Delete a menu.
    """
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found")
    
    db.delete(menu)
    db.commit()
    return menu

# --- Menu Items Management ---

@router.post("/{menu_id}/items", response_model=schemas.menu.Menu)
def add_menu_items(
    *,
    db: Session = Depends(deps.get_db),
    menu_id: int,
    items_in: List[schemas.menu.MenuItemCreate] = Body(...),
) -> Any:
    """
    Replace all items in a menu with a new list (useful for reordering and batch updates).
    """
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found")
    
    # Verify categories exist if provided
    for item in items_in:
        if item.category_id:
            category = db.query(Category).filter(Category.id == item.category_id).first()
            if not category:
                 raise HTTPException(status_code=400, detail=f"Category {item.category_id} not found")

    # Clear existing items
    db.query(MenuItem).filter(MenuItem.menu_id == menu_id).delete()
    
    # Add new items
    for item_data in items_in:
        item = MenuItem(**item_data.dict(), menu_id=menu_id)
        db.add(item)
    
    db.commit()
    db.refresh(menu)
    return menu
