from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1 import api_router
from app.core.config import settings
from app.core.exceptions import info_exception_handler, business_exception_handler, BusinessException
from app.db import base  # Ensure all models are loaded
from app.core import socket_manager # Import socket manager
import socketio # Import socketio library

# Rename to 'application' or 'fastapi_app' to distinguish, keeping 'app' as the final export for Uvicorn if needed
# But usually uvicorn in run_server.bat runs 'app.main:app'.
# So I will rename the FastAPI instance to 'fastapi_app' and the final ASGI app to 'app'.

fastapi_app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Backend for Mechanical Electronics E-commerce Shop",
    version="1.0.0"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    fastapi_app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

fastapi_app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount Static Files
import os
if not os.path.exists("static/uploads"):
    os.makedirs("static/uploads")
fastapi_app.mount("/static", StaticFiles(directory="static"), name="static")

# Register Exception Handlers
fastapi_app.add_exception_handler(Exception, info_exception_handler)
fastapi_app.add_exception_handler(BusinessException, business_exception_handler)

@fastapi_app.get("/")
def root():
    return {"message": "Welcome to Mechanical Electronics Shop API", "docs": "/docs"}

# ... (sitemap function needs @fastapi_app decorator) ...

# Wrap FastAPI with Socket.IO
# We need to import 'app' from main in run_server, so we export 'app'.
app = socketio.ASGIApp(socket_manager.sio, other_asgi_app=fastapi_app)

from fastapi import Response, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.product import Product
from app.models.category import Category
from datetime import datetime

@fastapi_app.get("/sitemap.xml", response_class=Response)
def get_sitemap(db: Session = Depends(deps.get_db)):
    base_url = "https://tekko.vn"
    
    # Static routes
    urls = [
        {"loc": f"{base_url}/", "changefreq": "daily", "priority": "1.0"},
        {"loc": f"{base_url}/products", "changefreq": "daily", "priority": "0.8"},
        {"loc": f"{base_url}/promotions", "changefreq": "daily", "priority": "0.8"},
        {"loc": f"{base_url}/contact", "changefreq": "monthly", "priority": "0.5"},
    ]

    # Categories
    categories = db.query(Category).all()
    for cat in categories:
        urls.append({
            "loc": f"{base_url}/?category_id={cat.id}", # Frontend uses query params for categories currently
            "changefreq": "weekly",
            "priority": "0.7"
        })

    # Products
    products = db.query(Product).all()
    for product in products:
        # Assuming product updated_at exists, else use now, or omit lastmod
        lastmod = datetime.now().strftime("%Y-%m-%d") 
        if hasattr(product, 'updated_at') and product.updated_at:
             lastmod = product.updated_at.strftime("%Y-%m-%d")

        urls.append({
            "loc": f"{base_url}/product/{product.slug}",
            "lastmod": lastmod,
            "changefreq": "weekly",
            "priority": "0.9"
        })

    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for url in urls:
        xml_content += '  <url>\n'
        xml_content += f'    <loc>{url["loc"]}</loc>\n'
        if "lastmod" in url:
            xml_content += f'    <lastmod>{url["lastmod"]}</lastmod>\n'
        xml_content += f'    <changefreq>{url["changefreq"]}</changefreq>\n'
        xml_content += f'    <priority>{url["priority"]}</priority>\n'
        xml_content += '  </url>\n'
    
    xml_content += '</urlset>'
    
    return Response(content=xml_content, media_type="application/xml")
