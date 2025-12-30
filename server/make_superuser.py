from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User

def make_superuser(email: str):
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"User with email {email} not found.")
            return

        user.is_superuser = True
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"User {email} is now a superuser!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    email = input("Enter the email of the user to make superuser: ")
    make_superuser(email)
