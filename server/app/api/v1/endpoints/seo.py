from typing import Any
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.category import Category
from app.api import deps
from datetime import datetime

router = APIRouter()

@router.get("/sitemap.xml")
def get_sitemap(
    db: Session = Depends(deps.get_db),
    base_url: str = "https://yourdomain.com" # Should be configurable via env
) -> Any:
    """
    Generate a dynamic sitemap.xml
    """
    products = db.query(Product).all()
    categories = db.query(Category).all()
    
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Static pages
    static_pages = ["", "/products", "/promotions", "/contact"]
    for page in static_pages:
        xml_content += f'  <url>\n    <loc>{base_url}{page}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n'
    
    # Product pages
    for p in products:
        xml_content += f'  <url>\n    <loc>{base_url}/product/{p.slug}</loc>\n    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n'
        
    # Category pages
    for cat in categories:
        xml_content += f'  <url>\n    <loc>{base_url}/products?category_id={cat.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n'
        
    xml_content += '</urlset>'
    
    return Response(content=xml_content, media_type="application/xml")
