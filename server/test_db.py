import sys
import os
sys.path.append(os.getcwd())

from sqlalchemy import create_engine, text
from app.core.config import settings

def test_connection():
    try:
        print(f"Testing connection to: {settings.SQLALCHEMY_DATABASE_URI}")
        engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, connect_args={'connect_timeout': 5})
        with engine.connect() as conn:
            print("Connected successfully!")
            result = conn.execute(text("SELECT 1"))
            print(f"Result: {result.fetchone()}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_connection()
