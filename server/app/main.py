from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1 import api_router
from app.core.config import settings
from app.core.exceptions import info_exception_handler, business_exception_handler, BusinessException
from app.db import base  # Ensure all models are loaded

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Backend for Mechanical Electronics E-commerce Shop",
    version="1.0.0"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount Static Files
import os
if not os.path.exists("static/uploads"):
    os.makedirs("static/uploads")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Register Exception Handlers
app.add_exception_handler(Exception, info_exception_handler)
app.add_exception_handler(BusinessException, business_exception_handler)

@app.get("/")
def root():
    return {"message": "Welcome to Mechanical Electronics Shop API", "docs": "/docs"}
