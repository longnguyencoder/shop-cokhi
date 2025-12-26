"""
Script to create menu tables in the database
"""
from app.db.session import engine
from app.db.base import Base
from app.models.menu import Menu, MenuItem

def create_tables():
    print("Creating menu tables...")
    Base.metadata.create_all(bind=engine, tables=[Menu.__table__, MenuItem.__table__])
    print("Menu tables created successfully!")

if __name__ == "__main__":
    create_tables()
