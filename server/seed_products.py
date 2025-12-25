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
    # Get existing categories and brands
    categories = db.query(Category).all()
    brands = db.query(Brand).all()

    if not categories or not brands:
        print("Error: Need at least one category and one brand to seed products.")
        return

    sample_products = [
        {
            "name": "Mũi Khoan Cứng Winstar WDS Series",
            "sku": "WS-DRILL-001",
            "description": "Mũi khoan carbide hiệu suất cao cho thép cứng và inox. Độ bền vượt trội với lớp phủ AlTiN.",
            "price": 450000,
            "diameter": "6.0mm",
            "length": "50mm",
            "material": "Carbide",
            "flutes": "2",
            "hardness": "55 HRC",
            "coating": "AlTiN"
        },
        {
            "name": "Dao Phay Ngón Kyocera 4MFR",
            "sku": "KY-MILL-001",
            "description": "Dao phay ngón đa năng Kyocera, chuyên dùng cho phay thô và tinh. Giảm rung chấn hiệu quả.",
            "price": 850000,
            "diameter": "10.0mm",
            "length": "75mm",
            "material": "Tungsten Carbide",
            "flutes": "4",
            "hardness": "60 HRC",
            "coating": "MEGACOAT NANO"
        },
        {
            "name": "Mảnh Dao Cắt Pramet CNMG",
            "sku": "PR-INSERT-001",
            "description": "Mảnh dao tiện Pramet cho gia công thép và gang. Khả năng chịu nhiệt và va đập tốt.",
            "price": 120000,
            "diameter": "N/A",
            "length": "12mm",
            "material": "Cermet",
            "flutes": "N/A",
            "hardness": "N/A",
            "coating": "PVD"
        },
        {
            "name": "Mũi Taro Tay Yamawa HT",
            "sku": "YM-TAP-001",
            "description": "Bộ mũi taro tay Yamawa Nhật Bản, độ chính xác cao, chuyên dụng cho làm ren vật liệu thép.",
            "price": 320000,
            "diameter": "M8",
            "length": "70mm",
            "material": "HSS-E",
            "flutes": "3",
            "hardness": "N/A",
            "coating": "Bright"
        },
        {
            "name": "Dao Phay Cầu Guhring GS200G",
            "sku": "GH-BALL-001",
            "description": "Dao phay cầu Guhring Germany, chuyên cho gia công khuôn mẫu 3D phức tạp.",
            "price": 1250000,
            "diameter": "8.0mm",
            "length": "100mm",
            "material": "Solid Carbide",
            "flutes": "2",
            "hardness": "62 HRC",
            "coating": "Fire"
        },
        {
            "name": "Mũi Khoan Cao Tốc Nachi L500",
            "sku": "NC-DRILL-001",
            "description": "Mũi khoan xoắn Nachi HSS, chuẩn JIS Nhật Bản, phù hợp cho mọi loại máy khoan bàn.",
            "price": 75000,
            "diameter": "5.0mm",
            "length": "86mm",
            "material": "HSS",
            "flutes": "2",
            "hardness": "N/A",
            "coating": "None"
        },
        {
            "name": "Mảnh Dao Phay Mitsubishi APMT",
            "sku": "MB-INSERT-001",
            "description": "Mảnh dao phay Mitsubishi Nhật Bản, chuyên cho phay vai 90 độ, thoát phôi cực tốt.",
            "price": 185000,
            "diameter": "11mm",
            "length": "N/A",
            "material": "Carbide",
            "flutes": "N/A",
            "hardness": "N/A",
            "coating": "VP15TF"
        },
        {
            "name": "Dao Tiện Ren Vertex SER",
            "sku": "VT-TOOL-001",
            "description": "Cán dao tiện ren ngoài Vertex Đài Loan, ổn định và cứng vững khi gia công ren bước lớn.",
            "price": 980000,
            "diameter": "20mm Shank",
            "length": "125mm",
            "material": "Alloy Steel",
            "flutes": "N/A",
            "hardness": "N/A",
            "coating": "Nickel"
        },
        {
            "name": "Mũi Doa Tay Presto HSS",
            "sku": "PT-REAMER-001",
            "description": "Mũi doa tay Presto chuẩn UK, lỗ doa bóng đẹp và đạt độ dung sai chuẩn H7.",
            "price": 550000,
            "diameter": "12mm",
            "length": "150mm",
            "material": "HSS",
            "flutes": "6",
            "hardness": "N/A",
            "coating": "None"
        },
        {
            "name": "Dao Cắt Đứt Iscar Do-Grip",
            "sku": "IS-CUT-001",
            "description": "Lưỡi dao cắt đứt Iscar Israel, công nghệ phôi cuộn độc quyền, giảm tối đa lực cắt.",
            "price": 420000,
            "diameter": "3.0mm Width",
            "length": "N/A",
            "material": "Carbide",
            "flutes": "N/A",
            "hardness": "N/A",
            "coating": "TiAlN"
        }
    ]

    for p_data in sample_products:
        # Check if SKU already exists
        existing = db.query(Product).filter(Product.sku == p_data["sku"]).first()
        if existing:
            print(f"Skipping {p_data['name']} (SKU {p_data['sku']} exists)")
            continue

        cat = random.choice(categories)
        brand = random.choice(brands)
        
        slug = p_data["sku"].lower().replace("-", "_") + "_" + str(random.randint(100, 999))
        
        new_product = Product(
            name=p_data["name"],
            sku=p_data["sku"],
            slug=slug,
            description=p_data["description"],
            price=p_data["price"],
            image_url=None,
            category_id=cat.id,
            brand_id=brand.id,
            diameter=p_data["diameter"],
            length=p_data["length"],
            material=p_data["material"],
            flutes=p_data["flutes"],
            hardness=p_data["hardness"],
            coating=p_data["coating"],
            on_sale=random.choice([True, False]),
            sale_price=p_data["price"] * 0.9 if random.random() > 0.5 else None,
            created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        db.add(new_product)
        print(f"Added {p_data['name']}")

    db.commit()
    print("Seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    seed()
