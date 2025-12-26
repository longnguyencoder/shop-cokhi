#!/bin/bash

# Configuration
PROJECT_ROOT="/var/www/shop-co-khi"
GITHUB_REPO="https://github.com/longnguyencoder/shop-cokhi.git"

echo "🚀 Starting deployment..."

# 1. Update code
cd $PROJECT_ROOT
git pull origin master

# 2. Update Backend
echo "📦 Updating Backend..."
cd $PROJECT_ROOT/server
source venv/bin/activate
pip install -r requirements.txt
# Optional: Run migrations
# alembic upgrade head
pm2 restart shop-co-khi-api

# 3. Update Frontend
echo "📦 Updating Frontend..."
cd $PROJECT_ROOT/client
npm install
npm run build

echo "✅ Deployment finished successfully!"
