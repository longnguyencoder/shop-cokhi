import sys
sys.path.insert(0, '.')

from app.core.email import send_contact_email

try:
    send_contact_email(
        name="Test User",
        email="test@test.com",
        phone="0123456789",
        message="This is a test message"
    )
    print("✅ Email sent successfully!")
except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
