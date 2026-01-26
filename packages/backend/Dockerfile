FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Cài nodemon cho dev
RUN npm install --save-dev nodemon

COPY . .

# Tạo script cho dev và prod
RUN npm run build

# Sử dụng biến môi trường NODE_ENV để chọn chế độ
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Nếu NODE_ENV=development thì chạy start:dev, ngược lại chạy production
CMD ["sh", "-c", "if [ $NODE_ENV = 'development' ]; then npm run start:dev; else node dist/main; fi"]