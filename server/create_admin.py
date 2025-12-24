from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def create_admin():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "admin@shopcokhi.vn").first()
        if not user:
            user = User(
                email="admin@shopcokhi.vn",
                hashed_password=get_password_hash("admin123"),
                full_name="Administrator",
                is_active=True,
                is_superuser=True
            )
            db.add(user)
            db.commit()
            print("Admin user created: admin@shopcokhi.vn / admin123")
        else:
            user.is_superuser = True
            db.add(user)
            db.commit()
            print("User admin@shopcokhi.vn already exists, ensured superuser status.")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
