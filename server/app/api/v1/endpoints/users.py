from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas, models
from app.api import deps
from app.repositories.user_repository import user_repository

router = APIRouter()

@router.get("/", response_model=List[schemas.User])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.user.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve users. Admin only.
    """
    users = user_repository.get_multi(db, skip=skip, limit=limit)
    return users

@router.put("/{user_id}", response_model=schemas.User)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    user_in: schemas.UserUpdate,
    current_user: models.user.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update a user. Admin only.
    """
    user = user_repository.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user = user_repository.update(db, db_obj=user, obj_in=user_in)
    return user

@router.delete("/{user_id}", response_model=schemas.User)
def delete_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    current_user: models.user.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete a user. Admin only.
    """
    user = user_repository.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    user = user_repository.remove(db, id=user_id)
    return user

@router.post("/{user_id}/toggle-active", response_model=schemas.User)
def toggle_user_active(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    current_user: models.user.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Toggle user active status. Admin only.
    """
    user = user_repository.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
    user = user_repository.update(db, db_obj=user, obj_in={"is_active": not user.is_active})
    return user
