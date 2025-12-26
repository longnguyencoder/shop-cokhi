"""
Quick script to update menu code from '1' to 'main_nav'
"""
from app.db.session import SessionLocal
from app.models.menu import Menu

def update_menu_code():
    db = SessionLocal()
    try:
        menu = db.query(Menu).filter(Menu.code == "1").first()
        if menu:
            menu.code = "main_nav"
            db.commit()
            print(f"✓ Updated menu '{menu.name}' code to 'main_nav'")
        else:
            print("✗ Menu with code '1' not found")
    finally:
        db.close()

if __name__ == "__main__":
    update_menu_code()
