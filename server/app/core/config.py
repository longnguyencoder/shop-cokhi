from typing import List, Union, Optional
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Shop Co Khi"
    
    # DATABASE
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "shop_co_khi"
    POSTGRES_PORT: str = "5432"
    SQLALCHEMY_DATABASE_URI: Union[str, None] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Union[str, None], values: dict) -> str:
        if isinstance(v, str):
            return v
        return f"postgresql://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}@{values.get('POSTGRES_SERVER')}:{values.get('POSTGRES_PORT', '5432')}/{values.get('POSTGRES_DB')}"

    # MAIL
    MAIL_SERVER: Optional[str] = None
    MAIL_PORT: Optional[int] = None
    MAIL_USE_TLS: bool = True
    MAIL_USERNAME: Optional[str] = None
    MAIL_PASSWORD: Optional[str] = None
    MAIL_DEFAULT_SENDER: Optional[str] = None

    # BACKEND_CORS_ORIGINS is a JSON-formatted list of strings
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    SECRET_KEY: str = "super_secret_key_change_me"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
