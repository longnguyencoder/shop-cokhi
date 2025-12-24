import logging
from pathlib import Path
from typing import Any, Dict

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_DEFAULT_SENDER,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

async def send_email(
    email_to: str,
    subject_template: str = "",
    html_template: str = "",
) -> None:
    message = MessageSchema(
        subject=subject_template,
        recipients=[email_to],
        body=html_template,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
    except Exception as e:
        logging.error(f"Error sending email to {email_to}: {str(e)}")

async def send_reset_password_email(email_to: str, email: str, token: str) -> None:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Password recovery for user {email}"
    server_host = "http://localhost:8000" # In prod this would be your frontend URL
    link = f"{server_host}/reset-password?token={token}"
    content = f"""
        <p>Hello,</p>
        <p>We received a request to reset your password for {project_name}.</p>
        <p>Please click on the link below to reset your password:</p>
        <p><a href="{link}">{link}</a></p>
        <p>If you didn't request a password reset, please ignore this email.</p>
    """
    await send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=content,
    )
