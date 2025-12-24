from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.category import Category
from app.models.product import Brand, Product, ProductSpec
from app.models.user import User
from app.core.security import get_password_hash

def seed_data(db: Session):
    # 1. Create Superuser
    if not db.query(User).filter(User.email == "admin@shop.com").first():
        admin = User(
            email="admin@shop.com",
            hashed_password=get_password_hash("admin123"),
            full_name="System Admin",
            is_superuser=True
        )
        db.add(admin)

    # 2. Create Categories
    categories = [
        {"name": "Dao Phay (End Mills)", "slug": "dao-phay"},
        {"name": "Mũi Khoan (Drills)", "slug": "mui-khoan"},
        {"name": "Mảnh Dao Cắt (Inserts)", "slug": "manh-dao-cat"},
    ]
    
    cat_objs = {}
    for cat_data in categories:
        cat = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
        if not cat:
            cat = Category(**cat_data)
            db.add(cat)
            db.flush()
        cat_objs[cat.slug] = cat

    # 3. Create Brands
    brands = [
        {"name": "Dormer Pramet", "description": "Global manufacturer of metal cutting tools."},
        {"name": "Kyocera", "description": "Kyocera Fineceramics Europe."},
        {"name": "Winstar", "description": "High performance cutting tools from Taiwan."},
    ]
    
    brand_objs = {}
    for brand_data in brands:
        brand = db.query(Brand).filter(Brand.name == brand_data["name"]).first()
        if not brand:
            brand = Brand(**brand_data)
            db.add(brand)
            db.flush()
        brand_objs[brand.name] = brand

    # 4. Create Sample Products
    products = [
        {
            "name": "Mũi Khoan Thép Gió HSS A002",
            "sku": "DORMER-A002-10",
            "slug": "mui-khoan-hss-a002-10",
            "description": "Mũi khoan thép gió phủ TiN, đạt chuẩn DIN 338.",
            "price": 150000.0,
            "category_id": cat_objs["mui-khoan"].id,
            "brand_id": brand_objs["Dormer Pramet"].id,
            "specs": [
                {"key": "Vật liệu", "value": "HSS-TiN"},
                {"key": "Đường kính", "value": "10mm"},
                {"key": "Chiều dài", "value": "133mm"}
            ]
        },
        {
            "name": "Dao Phay Ngón Cacbit Winstar 4 Mê",
            "slug": "dao-phay-ngon-winstar-4-me",
            "sku": "WINSTAR-EM-4-12",
            "description": "Dao phay ngón hợp kim 4 lưỡi cắt, chuyên gia công thép cứng.",
            "price": 450000.0,
            "category_id": cat_objs["dao-phay"].id,
            "brand_id": brand_objs["Winstar"].id,
            "specs": [
                {"key": "Vật liệu", "value": "Carbide"},
                {"key": "Số lưỡi cắt", "value": "4"},
                {"key": "Góc xoắn", "value": "35 độ"}
            ]
        }
    ]

    for p_data in products:
        p = db.query(Product).filter(Product.sku == p_data["sku"]).first()
        if not p:
            specs_data = p_data.pop("specs")
            p = Product(**p_data)
            db.add(p)
            db.flush()
            for spec in specs_data:
                db.add(ProductSpec(product_id=p.id, **spec))

    db.commit()

if __name__ == "__main__":
    db = SessionLocal()
    seed_data(db)
    print("Seed data created successfully!")
