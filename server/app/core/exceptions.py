from fastapi import Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
import logging

logger = logging.getLogger(__name__)

async def info_exception_handler(request: Request, exc: Exception):
    """
    Standard professional exception handler to avoid leaking internal details
    and provide clean JSON responses.
    """
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    
    if isinstance(exc, SQLAlchemyError):
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Database error occurred.", "code": "DB_ERROR"},
        )
        
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred.", "code": "INTERNAL_ERROR"},
    )

class BusinessException(Exception):
    def __init__(self, detail: str, status_code: int = 400, code: str = "ERROR"):
        self.detail = detail
        self.status_code = status_code
        self.code = code

async def business_exception_handler(request: Request, exc: BusinessException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "code": exc.code},
    )
