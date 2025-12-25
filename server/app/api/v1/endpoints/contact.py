from typing import Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.core.email import send_contact_email

router = APIRouter()

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str

@router.post("/send")
def send_contact_form(
    *,
    form_data: ContactForm,
) -> Any:
    """
    Send contact form via email.
    """
    try:
        send_contact_email(
            name=form_data.name,
            email=form_data.email,
            phone=form_data.phone,
            message=form_data.message
        )
        return {"message": "Email sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")
