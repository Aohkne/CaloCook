# 🛠️ CaloCook - Setup & Support Guide

## 🛠️ Technology Stack

### Backend

| Technology                                                                                                     | Description                    |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)     | JavaScript runtime for backend |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | Minimalist web framework       |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)       | NoSQL document database        |
| ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)       | API documentation and testing  |

### Frontend

| Technology                                                                                                        | Description                             |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | Cross-platform mobile framework for app |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)                   | Fast build tool for web development     |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)               | JavaScript library for web UI           |
| ![Expo Go](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)                | Development platform for React Native   |

## ⚙️ Environment Variables

### Backend (.env)

```bash
AUTHOR=''
MONGODB_URI=''
DATABASE_NAME=''
HOST=''
PORT=''
UPSTASH_REDIS_URL=''
ACCESS_TOKEN_SECRET=''
REFRESH_TOKEN_SECRET=''
YOUR_GOOGLE_CLIENT_ID=''
YOUR_GOOGLE_CLIENT_SECRET=''
GMAIL_USER=''
GMAIL_PASS=''
```

### Frontend App (.env)

```bash
# API Configuration
AUTHOR= ''
API_URL= ''
```

### Frontend Web (.env)

```bash
# API Configuration
VITE_API_BASE_URL=''
VITE_API_TIMEOUT=''

# Environment
VITE_NODE_ENV=''

# Application Settings
VITE_APP_NAME=''
VITE_APP_VERSION=''
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 hoặc cao hơn)
- MongoDB
- Expo CLI (cho mobile app)
- npm hoặc yarn

### Backend Setup

1. Clone repository và di chuyển vào thư mục backend:

```bash
git clone https://github.com/Aohkne/CaloCook.git
cd CaloCook/Back-end
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env` từ `.env.example` và cấu hình các biến môi trường:

```bash
cp .env.example .env
```

4. Khởi chạy server:

```bash
npm run dev
```

Server sẽ chạy trên `http://localhost:8080` và Swagger documentation tại `http://localhost:8080/api-docs`

### Frontend Setup

#### Mobile App (React Native)

1. Di chuyển vào thư mục app:

```bash
cd Front-end/app
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

4. Khởi chạy app với Expo:

```bash
npx expo start
```

hoặc

```bash
npm start
```

App sẽ chạy trên Metro bundler. Địa chỉ chính xác sẽ được hiển thị trong terminal khi chạy lệnh `npm start` (thường là `exp://[YOUR_LOCAL_IP]:8081`)

#### Web App (React + Vite)

1. Di chuyển vào thư mục web:

```bash
cd Front-end/web
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

4. Khởi chạy development server:

```bash
npm run dev
```

Web app sẽ chạy trên `http://localhost:3000`

## 🔗 Application URLs

- **Backend API**: http://localhost:8080
- **Swagger Documentation**: http://localhost:8080/api-docs
- **Web Application**: http://localhost:3000
- **Mobile App**: Metro bundler sẽ hiển thị địa chỉ (thường là exp://[YOUR_LOCAL_IP]:8081)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 🆘 Troubleshooting

### Backend Issues

- **MongoDB Connection Error**: Kiểm tra lại `MONGODB_URI` trong file `.env`
- **Port Already in Use**: Thay đổi `PORT` trong file `.env` hoặc kill process đang sử dụng port
- **Dependencies Error**: Xóa `node_modules` và chạy lại `npm install`

### Frontend Issues

- **API Connection Error**: Kiểm tra lại `API_BASE_URL` hoặc `VITE_API_BASE_URL`
- **Expo Error**: Đảm bảo Expo CLI đã được cài đặt: `npm install -g @expo/cli`
- **Metro Bundler Error**: Xóa cache với `npx expo start -c`

### General Issues

- **Node.js Version**: Đảm bảo sử dụng Node.js v16 trở lên
- **Network Issues**: Kiểm tra firewall và network permissions
- **Environment Variables**: Đảm bảo tất cả biến môi trường đã được cấu hình đúng

## 📞 Support Contact

- **Email**: aohkne@gmail.com
- **GitHub Issues**: https://github.com/Aohkne/CaloCook/issues
- **Project Repository**: https://github.com/Aohkne/CaloCook
