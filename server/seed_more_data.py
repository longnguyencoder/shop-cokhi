import os
import random
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.product import Product, Brand
from app.models.category import Category
from datetime import datetime

# Connect to DB
db_url = settings.SQLALCHEMY_DATABASE_URI
engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def seed():
    print("Starting seeding process...")

    # 1. Create Categories
    new_categories_data = [
        {"name": "Dụng cụ đo kiểm", "slug": "dung-cu-do-kiem", "image_url": "/api/v1/static/categories/measuring.jpg"},
        {"name": "Phụ kiện máy tiện", "slug": "phu-kien-may-tien", "image_url": "/api/v1/static/categories/lathe-parts.jpg"}
    ]

    created_categories = {}

    for cat_data in new_categories_data:
        existing_cat = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
        if existing_cat:
            print(f"Category '{cat_data['name']}' already exists.")
            created_categories[cat_data["slug"]] = existing_cat
        else:
            new_cat = Category(
                name=cat_data["name"],
                slug=cat_data["slug"],
                image_url=cat_data["image_url"],
                parent_id=None
            )
            db.add(new_cat)
            db.commit()
            db.refresh(new_cat)
            created_categories[cat_data["slug"]] = new_cat
            print(f"Created category '{cat_data['name']}'.")

    # 2. Ensure at least one Brand exists (or get existing ones)
    brands = db.query(Brand).all()
    if not brands:
        print("No brands found. Creating a default brand.")
        default_brand = Brand(name="Mitutoyo", slug="mitutoyo", logo_url=None)
        db.add(default_brand)
        db.commit()
        db.refresh(default_brand)
        brands = [default_brand]
    
    # 3. Create Products for "Dụng cụ đo kiểm"
    measuring_products = [
        {
            "name": "Thước cặp điện tử Mitutoyo 500-196-30",
            "sku": "MT-CAL-001",
            "description": "Thước cặp điện tử Mitutoyo 0-150mm, độ chính xác cao, chống nước IP67.",
            "price": 2500000,
            "diameter": "N/A", "length": "150mm", "material": "Stainless Steel", 
            "flutes": "N/A", "hardness": "N/A", "coating": "N/A"
        },
        {
            "name": "Panme đo ngoài Mitutoyo 103-137",
            "sku": "MT-MIC-001",
            "description": "Panme đo ngoài cơ khí, dải đo 0-25mm, độ chia 0.01mm.",
            "price": 1200000,
            "diameter": "N/A", "length": "N/A", "material": "Carbide Faces",
            "flutes": "N/A", "hardness": "N/A", "coating": "Enamel"
        },
        {
            "name": "Đồng hồ so Insize 2308-10A",
            "sku": "IS-IND-001",
            "description": "Đồng hồ so cơ khí, dải đo 0-10mm, độ chia 0.01mm, lưng phẳng.",
            "price": 450000,
            "diameter": "58mm Dial", "length": "N/A", "material": "Steel",
            "flutes": "N/A", "hardness": "N/A", "coating": "None"
        },
        {
            "name": "Thước độ sâu điện tử Mitutoyo 571-201-30",
            "sku": "MT-DEPTH-001",
            "description": "Thước đo độ sâu điện tử Absolute, dải đo 0-150mm.",
            "price": 3100000,
            "diameter": "N/A", "length": "150mm", "material": "Stainless Steel",
            "flutes": "N/A", "hardness": "N/A", "coating": "None"
        },
        {
            "name": "Bộ căn mẫu thép cấp 1 Mitutoyo 516-954",
            "sku": "MT-BLOCK-001",
            "description": "Bộ căn mẫu chuẩn 47 miếng, cấp chính xác 1, dùng để kiểm chuẩn.",
            "price": 15000000,
            "diameter": "N/A", "length": "N/A", "material": "Steel",
            "flutes": "N/A", "hardness": "64 HRC", "coating": "None"
        },
        {
            "name": "Thước đo cao điện tử Insize 1150-300",
            "sku": "IS-HEIGHT-001",
            "description": "Thước đo cao điện tử dải đo 0-300mm, độ chính xác 0.01mm.",
            "price": 4800000,
            "diameter": "N/A", "length": "300mm", "material": "Stainless Steel",
            "flutes": "N/A", "hardness": "N/A", "coating": "None"
        },
        {
            "name": "Dưỡng kiểm ren trục Sokuhansha M10x1.5",
            "sku": "SH-THREAD-001",
            "description": "Bộ dưỡng kiểm ren trục (Ring Gauge) GO/NOGO chuẩn JIS.",
            "price": 1800000,
            "diameter": "M10", "length": "N/A", "material": "Tool Steel",
            "flutes": "N/A", "hardness": "60 HRC", "coating": "None"
        },
        {
            "name": "Thước ê ke cơ khí Insize 4791-200",
            "sku": "IS-SQUARE-001",
            "description": "Ê ke vuông góc 90 độ, kích thước 200x130mm, cấp chính xác 00.",
            "price": 650000,
            "diameter": "N/A", "length": "200mm", "material": "Granite/Steel",
            "flutes": "N/A", "hardness": "N/A", "coating": "None"
        },
        {
            "name": "Thước đo góc vạn năng Mitutoyo 187-901",
            "sku": "MT-PROT-001",
            "description": "Thước đo góc vạn năng với đồng hồ hiển thị, kèm kính lúp.",
            "price": 3500000,
            "diameter": "N/A", "length": "300mm Blade", "material": "Stainless Steel",
            "flutes": "N/A", "hardness": "N/A", "coating": "Chrome"
        },
        {
            "name": "Panme đo lỗ 3 chấu Mitutoyo 368-168",
            "sku": "MT-BORE-001",
            "description": "Panme đo lỗ 3 chấu Holtest, dải đo 20-25mm, độ chính xác cao.",
            "price": 6200000,
            "diameter": "20-25mm", "length": "N/A", "material": "Carbide Pins",
            "flutes": "N/A", "hardness": "N/A", "coating": "TiN"
        }
    ]

    # 4. Create Products for "Phụ kiện máy tiện"
    lathe_products = [
        {
            "name": "Mâm cặp 3 chấu Vertex VSC-3",
            "sku": "VT-CHUCK-003",
            "description": "Mâm cặp máy tiện 3 chấu tự định tâm, đường kính 85mm.",
            "price": 2100000,
            "diameter": "85mm", "length": "N/A", "material": "Cast Iron",
            "flutes": "N/A", "hardness": "N/A", "coating": "None"
        },
        {
            "name": "Chống tâm quay máy tiện Vertex VLC-MT3",
            "sku": "VT-CENTER-MT3",
            "description": "Mũi chống tâm quay tải trọng nhẹ, chuôi côn MT3, tốc độ cao.",
            "price": 850000,
            "diameter": "MT3", "length": "N/A", "material": "Alloy Steel",
            "flutes": "N/A", "hardness": "58 HRC", "coating": "None"
        },
        {
            "name": "Đài dao nhanh Vertex VTP-100",
            "sku": "VT-POST-001",
            "description": "Bộ đài dao thay nhanh kiểu piston, size 100, kèm 4 gá dao.",
            "price": 4500000,
            "diameter": "N/A", "length": "N/A", "material": "Steel",
            "flutes": "N/A", "hardness": "50 HRC", "coating": "Black Oxide"
        },
        {
            "name": "Sưu tập Collet ER32 Vertex",
            "sku": "VT-COLLET-ER32",
            "description": "Bộ collet ER32 gồm 18 chi tiết, dải kẹp từ 3-20mm.",
            "price": 3200000,
            "diameter": "ER32", "length": "N/A", "material": "Spring Steel",
            "flutes": "N/A", "hardness": "48 HRC", "coating": "None"
        },
        {
            "name": "Mặt bích mâm cặp 6 inch",
            "sku": "LT-PLATE-006",
            "description": "Mặt bích nối mâm cặp máy tiện 6 inch chuẩn D1-4.",
            "price": 1100000,
            "diameter": "6 inch", "length": "N/A", "material": "Cast Iron",
            "flutes": "N/A", "hardness": "N/A", "coating": "Machined"
        },
        {
            "name": "Luy nét tĩnh Vertex VSR-6",
            "sku": "VT-REST-001",
            "description": "Luy nét tĩnh (Steady Rest) cho máy tiện, hỗ trợ tiện trục dài.",
            "price": 2800000,
            "diameter": "10-90mm Capacity", "length": "N/A", "material": "Cast Iron",
            "flutes": "N/A", "hardness": "N/A", "coating": "Paint"
        },
        {
            "name": "Tốc máy tiện thẳng Vertex VDC-25",
            "sku": "VT-DOG-001",
            "description": "Tốc kẹp thẳng truyền động cho máy tiện, kẹp max 25mm.",
            "price": 250000,
            "diameter": "25mm Max", "length": "N/A", "material": "Steel",
            "flutes": "N/A", "hardness": "N/A", "coating": "Black"
        },
        {
            "name": "Chuôi côn khoan MT2-B16",
            "sku": "TL-ARBOR-001",
            "description": "Chuôi côn lắp bầu khoan, đuôi MT2, đầu B16.",
            "price": 150000,
            "diameter": "MT2/B16", "length": "110mm", "material": "Steel",
            "flutes": "N/A", "hardness": "45 HRC", "coating": "Polished"
        },
        {
            "name": "Bầu khoan 16mm khóa lục giác",
            "sku": "TL-CHUCK-16",
            "description": "Bầu khoan kẹp mũi từ 1-16mm, khóa bằng chìa lục giác, độ đồng tâm cao.",
            "price": 680000,
            "diameter": "1-16mm", "length": "N/A", "material": "Alloy Steel",
            "flutes": "N/A", "hardness": "N/A", "coating": "None"
        },
        {
            "name": "Cán dao móc lỗ S20R-MWLNR08",
            "sku": "TL-BORING-001",
            "description": "Cán dao tiện móc lỗ đường kính 20mm, gắn mảnh WNMG0804.",
            "price": 860000,
            "diameter": "20mm", "length": "200mm", "material": "Steel",
            "flutes": "N/A", "hardness": "40 HRC", "coating": "Black Oxide"
        }
    ]

    # Helper function to add products
    def add_products(product_list, category, brands_list):
        for p_data in product_list:
             # Check if SKU already exists
            existing = db.query(Product).filter(Product.sku == p_data["sku"]).first()
            if existing:
                print(f"Skipping {p_data['name']} (SKU {p_data['sku']} exists)")
                continue
            
            # Create unique slug
            base_slug = p_data["sku"].lower().replace("-", "_")
            slug = f"{base_slug}_{random.randint(100, 9999)}"
            
            # Pick a random brand
            brand = random.choice(brands_list)

            new_product = Product(
                name=p_data["name"],
                sku=p_data["sku"],
                slug=slug,
                description=p_data["description"],
                price=p_data["price"],
                image_url=None, # Placeholder
                category_id=category.id,
                brand_id=brand.id,
                diameter=p_data["diameter"],
                length=p_data["length"],
                material=p_data["material"],
                flutes=p_data["flutes"],
                hardness=p_data["hardness"],
                coating=p_data["coating"],
                on_sale=random.choice([True, False]),
                sale_price=p_data["price"] * 0.9 if random.random() > 0.7 else None,
                created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            )
            db.add(new_product)
            print(f"Added product: {p_data['name']}")

    # Add products to categories
    if created_categories.get("dung-cu-do-kiem"):
        add_products(measuring_products, created_categories["dung-cu-do-kiem"], brands)
    
    if created_categories.get("phu-kien-may-tien"):
        add_products(lathe_products, created_categories["phu-kien-may-tien"], brands)

    db.commit()
    print("Seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed()
