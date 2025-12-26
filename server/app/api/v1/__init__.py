from fastapi import APIRouter
from app.api.v1.endpoints import auth, categories, products, orders, brands, users, contact, menus, seo

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(brands.router, prefix="/brands", tags=["brands"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])
api_router.include_router(menus.router, prefix="/menus", tags=["menus"])
api_router.include_router(seo.router, prefix="/seo", tags=["seo"])
