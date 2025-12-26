# Hướng dẫn cấu hình VPS cho Shop Cơ Khí

Tài liệu này hướng dẫn cách cấu hình và triển khai ứng dụng lên VPS sử dụng **Nginx**, **Gunicorn**, và **PM2**.

## 1. Chuẩn bị VPS
Đảm bảo VPS đã cài đặt:
- Python 3.10+
- Node.js & npm (phiên bản mới nhất)
- Nginx
- PM2 (`npm install -g pm2`)

## 2. Cấu trúc thư mục khuyên dùng
```bash
/var/www/shop-co-khi/
├── client/         # Source code frontend
│   └── dist/       # Build sau khi chạy npm run build
└── server/         # Source code backend
    └── venv/       # Virtual environment python
```

## 3. Cấu hình Backend (PM2)
Sử dụng file `deployment/ecosystem.config.js`:
1. Copy file này vào thư mục `/var/www/shop-co-khi/server`
2. Tạo virtual environment: `python3 -m venv venv`
3. Cài đặt dependency: `./venv/bin/pip install -r requirements.txt gunicorn uvicorn`
4. Khởi chạy: `pm2 start ecosystem.config.js`

## 4. Cấu hình Frontend
Tại thư mục `client`, tạo file `.env.production`:
```env
VITE_API_URL=http://your_domain.com/api/v1
```
Sau đó chạy:
```bash
npm install
npm run build
```

## 5. Cấu hình Nginx
1. Copy nội dung file `deployment/nginx.conf` vào `/etc/nginx/sites-available/shop-co-khi`
2. Chỉnh sửa `server_name` thành domain/IP của bạn.
3. Kích hoạt cấu hình:
```bash
sudo ln -s /etc/nginx/sites-available/shop-co-khi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 6. Tự động hóa bản cập nhật
Sử dụng script `deployment/deploy.sh` mỗi khi có thay đổi trên GitHub:
```bash
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

---
> [!IMPORTANT]
> Lưu ý cấu hình biến môi trường `.env` trong thư mục `server/` tương ứng với database trên VPS.
