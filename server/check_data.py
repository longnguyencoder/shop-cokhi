from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.product import Product
from app.models.category import Category

db_url = settings.SQLALCHEMY_DATABASE_URI
if not db_url:
    # Build it manually if validator didn't run (unlikely but safe)
    db_url = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"

print(f"Connecting to: {db_url}")
engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

results = db.query(
    Product.category_id, 
    Category.name,
    func.count(Product.id)
).join(Category).group_by(Product.category_id, Category.name).all()

print(f"{'Category ID':<12} {'Category Name':<30} {'Product Count':<15}")
print("-" * 60)
for cat_id, cat_name, count in results:
    print(f"{cat_id:<12} {cat_name:<30} {count:<15}")

db.close()
