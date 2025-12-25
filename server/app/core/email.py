import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from app.core.config import settings

def send_contact_email(name: str, email: str, phone: str, message: str):
    """
    Send contact form email to admin
    """
    # Log contact info to console
    print("\n" + "="*60)
    print("📧 NEW CONTACT FORM SUBMISSION")
    print("="*60)
    print(f"👤 Name: {name}")
    print(f"📧 Email: {email}")
    print(f"📱 Phone: {phone}")
    print(f"💬 Message: {message}")
    print(f"🕐 Time: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    print("="*60 + "\n")
    
    # Send email
    if not all([settings.MAIL_SERVER, settings.MAIL_USERNAME, settings.MAIL_PASSWORD]):
        raise Exception("Email configuration is not complete")
    
    # Create message
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f"[Shop Cơ Khí] Liên hệ mới từ {name}"
    msg['From'] = settings.MAIL_DEFAULT_SENDER
    msg['To'] = settings.MAIL_USERNAME  # Send to admin email
    
    # HTML email body
    html = f"""
    <html>
      <head>
        <style>
          body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
          .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
          .header {{ background: #1B2631; color: #EDB917; padding: 20px; text-align: center; }}
          .content {{ background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }}
          .field {{ margin-bottom: 15px; }}
          .label {{ font-weight: bold; color: #1B2631; }}
          .value {{ margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #EDB917; }}
          .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📧 LIÊN HỆ MỚI TỪ WEBSITE</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Họ và tên:</div>
              <div class="value">{name}</div>
            </div>
            <div class="field">
              <div class="label">📧 Email:</div>
              <div class="value">{email}</div>
            </div>
            <div class="field">
              <div class="label">📱 Số điện thoại:</div>
              <div class="value">{phone}</div>
            </div>
            <div class="field">
              <div class="label">💬 Nội dung:</div>
              <div class="value">{message}</div>
            </div>
            <div class="field">
              <div class="label">🕐 Thời gian:</div>
              <div class="value">{datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</div>
            </div>
          </div>
          <div class="footer">
            <p>Email này được gửi tự động từ website Shop Cơ Khí</p>
          </div>
        </div>
      </body>
    </html>
    """
    
    # Attach HTML part
    part = MIMEText(html, 'html')
    msg.attach(part)
    
    # Send email
    try:
        server = smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT)
        server.starttls()
        server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"✅ Contact email sent successfully to {settings.MAIL_USERNAME}")
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")
        raise e
