#!/bin/bash
# Git deploy script - pull trước, rồi commit và push

set -e  # Dừng script nếu có lỗi

echo "🚀 Bắt đầu deploy..."

# Bước 1: Pull code mới nhất
echo "📥 Đang pull code mới nhất từ remote..."
git pull origin main

# Bước 2: Add tất cả thay đổi
echo "📦 Đang add thay đổi..."
git add .

# Bước 3: Commit với message truyền vào hoặc mặc định
if [ -z "$1" ]; then
  msg="update: $(date '+%Y-%m-%d %H:%M:%S')"
else
  msg="$1"
fi

echo "📝 Commit message: $msg"
git commit -m "$msg"

# Bước 4: Push lên remote
echo "🚀 Đang push lên remote..."
git push origin main

echo "✅ Deploy thành công!"
