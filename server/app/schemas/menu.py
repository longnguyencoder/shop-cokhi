from typing import List, Optional, Any
from pydantic import BaseModel
from datetime import datetime

# MenuItem Schemas
class MenuItemBase(BaseModel):
    category_id: Optional[int] = None
    custom_title: Optional[str] = None
    custom_url: Optional[str] = None
    sort_order: int = 0

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(MenuItemBase):
    pass

class MenuItem(MenuItemBase):
    id: int
    menu_id: int
    category: Optional[Any] = None  # Will be populated by ORM
    
    class Config:
        from_attributes = True

# Menu Schemas
class MenuBase(BaseModel):
    name: str
    code: str
    is_active: bool = True

class MenuCreate(MenuBase):
    pass

class MenuUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    is_active: Optional[bool] = None

class Menu(MenuBase):
    id: int
    created_at: datetime
    updated_at: datetime
    items: List[MenuItem] = []

    class Config:
        from_attributes = True
