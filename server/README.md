# Professional Mechanical Electronics Shop Backend

This backend is built with **FastAPI** following **Clean Architecture** principles, designed for high scalability and maintainability.

## 🏗 Architecture Overview

The system is divided into several layers:
- **API (`app/api`)**: Handles HTTP requests, dependency injection, and routing.
- **Schemas (`app/schemas`)**: Pydantic models for data validation and serialization (OpenAPI/Swagger auto-doc).
- **Repositories (`app/repositories`)**: Data access layer using the **Repository Pattern** to decouple business logic from the database (SQLAlchemy).
- **Models (`app/models`)**: SQLAlchemy ORM entities.
- **Core (`app/core`)**: Cross-cutting concerns like security (JWT), configuration, and logging.

## ⚙ Core Features

1. **Flexible Product Catalog**: Supports complex mechanical technical specifications (dynamic key-value specs).
2. **Nested Categories**: Unlimited depth for organizing complex tool hierarchies.
3. **Advanced Filtering**: Multi-criteria search by SKU, Brand, and Category.
4. **B2B Lead Gen**: Integrated "Product Inquiry" system for high-value items without direct prices.
5. **Security**: Robust JWT-based authentication with bcrypt password hashing.

## 🚀 Getting Started

1. Install dependencies: `pip install -r requirements.txt`
2. Configure `.env` with your database credentials.
3. Run with Uvicorn: `uvicorn app.main:app --reload`
4. Access documentation at `http://localhost:8000/docs`.
