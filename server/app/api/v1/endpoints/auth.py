from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import schemas, models
from app.api import deps
from app.core import security
from app.core.config import settings
from app.repositories.user_repository import user_repository

router = APIRouter()

@router.post("/login/access-token", response_model=schemas.Token)
def login_access_token(
    login_data: schemas.UserLogin,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Token login, get an access token for future requests
    """
    user = user_repository.authenticate(
        db, email=login_data.username, password=login_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register", response_model=schemas.User)
def register_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = user_repository.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = user_repository.create(db, obj_in=user_in)
    return user

@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: models.user.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=schemas.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserUpdate,
    current_user: models.user.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    user = user_repository.update(db, db_obj=current_user, obj_in=user_in)
    return user

@router.post("/password-recovery/{email}", response_model=schemas.Msg)
async def recover_password(email: str, db: Session = Depends(deps.get_db)) -> Any:
    """
    Password Recovery.
    """
    user = user_repository.get_by_email(db, email=email)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )
    password_reset_token = security.create_access_token(
        user.id, expires_delta=timedelta(hours=1)
    )
    from app.services.email_service import send_reset_password_email
    await send_reset_password_email(
        email_to=user.email, email=email, token=password_reset_token
    )
    return {"msg": "Password recovery email sent"}

@router.post("/reset-password", response_model=schemas.Msg)
def reset_password(
    *,
    db: Session = Depends(deps.get_db),
    body: schemas.token.NewPassword,
) -> Any:
    """
    Reset password.
    """
    from jose import jwt, JWTError
    try:
        payload = jwt.decode(
            body.token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.token.TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=400,
            detail="Invalid token",
        )
    user = user_repository.get(db, id=token_data.sub)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this username does not exist in the system.",
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    user_repository.update(db, db_obj=user, obj_in={"password": body.new_password})
    return {"msg": "Password updated successfully"}
