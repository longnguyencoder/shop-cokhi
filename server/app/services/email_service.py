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

async def send_new_order_email(order: Any) -> None:
    """
    Send email to admin when a new order is placed.
    """
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - New Order #{order.id}"
    email_to = settings.MAIL_DEFAULT_SENDER # Send to admin
    
    # Format items list
    items_html = "<ul>"
    for item in order.items:
        # Assuming product relationship is loaded
        product_name = item.product.name if item.product else "Product"
        items_html += f"<li>{product_name} - Qty: {item.quantity} - Price: {item.price_at_purchase:,.0f} VND</li>"
    items_html += "</ul>"
    
    content = f"""
        <h2>New Order Received #{order.id}</h2>
        <p>You have received a new order from <b>{order.customer_name}</b>.</p>
        <h3>Customer Details:</h3>
        <p>
            Name: {order.customer_name}<br>
            Phone: {order.customer_phone}<br>
            Email: {order.customer_email}<br>
            Address: {order.shipping_address}
        </p>
        <h3>Order Items:</h3>
        {items_html}
        <p><b>Total Amount: {order.total_amount:,.0f} VND</b></p>
        <p>Please check the admin panel for more details.</p>
    """
    
    await send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=content,
    )

async def send_order_confirmation_email(order: Any) -> None:
    """
    Send confirmation email to customer.
    """
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Order Confirmation #{order.id}"
    email_to = order.customer_email
    
    items_html = "<ul>"
    for item in order.items:
        product_name = item.product.name if item.product else "Product"
        items_html += f"<li>{product_name} - Qty: {item.quantity} - Price: {item.price_at_purchase:,.0f} VND</li>"
    items_html += "</ul>"
    
    content = f"""
        <h2>Thank you for your order!</h2>
        <p>Hello {order.customer_name},</p>
        <p>We have received your order <b>#{order.id}</b> and are processing it.</p>
        <h3>Order Summary:</h3>
        {items_html}
        <p><b>Total: {order.total_amount:,.0f} VND</b></p>
        <p>We will contact you shortly to confirm delivery details.</p>
        <p>Best regards,<br>{project_name} Team</p>
    """
    
    await send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=content,
    )
