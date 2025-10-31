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

---

## 🔗 Deployed Servers

### Backend:

- [https://calocook.onrender.com/api-docs/#/](https://calocook.onrender.com/api-docs/#/)

### Frontend:

- **Web**: [https://calo-cook.vercel.app/](https://calo-cook.vercel.app/)
- **Mobile App (APK)**: [Xem hướng dẫn build APK](#-build-apk-for-android-expo-eas)

---

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

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 hoặc cao hơn)
- MongoDB
- Expo CLI (cho mobile app)
- npm hoặc yarn

### Backend Setup

```bash
# 1. Clone project và vào thư mục backend
git clone https://github.com/Aohkne/CaloCook.git
cd CaloCook/Back-end

# 2. Cài đặt dependencies
npm install

# 3. Tạo file .env
cp .env.example .env

# 4. Chạy server
npm run dev
```

Server chạy tại `http://localhost:8080`  
Swagger docs tại `http://localhost:8080/api-docs`

---

### Frontend Setup

#### Mobile App (React Native)

```bash
# 1. Vào thư mục app
cd Front-end/app

# 2. Cài dependencies
npm install

# 3. Tạo file .env
cp .env.example .env

# 4. Khởi chạy với Expo
npx expo start
# hoặc
npm start
```

#### Web App (React + Vite)

```bash
# 1. Vào thư mục web
cd Front-end/web

# 2. Cài dependencies
npm install

# 3. Tạo file .env
cp .env.example .env

# 4. Chạy web
npm run dev
```

---

## 📦 Build APK for Android (Expo EAS)

```bash
# 👉 Bước 1: Đảm bảo backend đang ở môi trường production
# Trong file .env của Back-end, thêm dòng sau:
NODE_ENV=production

# 👉 Bước 2: Cài đặt eas-cli vào dự án
npm install eas-cli --save-dev

# 👉 Bước 3: Đăng nhập vào tài khoản Expo (nếu chưa đăng nhập)
npx eas login
# Sẽ yêu cầu:
# username/email:
# password:

# 👉 Bước 4: Cấu hình eas build
npx eas build:configure

# 👉 Bước 5: Tiến hành build file APK
npx eas build -p android --profile preview
```

Sau khi build xong, bạn sẽ nhận được link tải file APK trong terminal.

---

## 📦 Build AAB for Upload Google Play (Expo EAS)

```bash
# 👉 Bước 1: Đảm bảo backend đang ở môi trường production
# Trong file .env của Back-end, thêm dòng sau:
NODE_ENV=production

# 👉 Bước 2: Cài đặt eas-cli vào dự án
npm install eas-cli --save-dev

# 👉 Bước 3: Đăng nhập vào tài khoản Expo (nếu chưa đăng nhập)
npx eas login
# Sẽ yêu cầu:
# username/email:
# password:

# 👉 Bước 4: Cấu hình eas build
npx eas build:configure

# 👉 Bước 5: Tiến hành build file ABB
npx eas build

# 👉 Bước 6: Chọn Platform Android
```

---

## 🔗 Application URLs

- **Backend API**: http://localhost:8080
- **Swagger Documentation**: http://localhost:8080/api-docs
- **Web Application**: http://localhost:3000
- **Mobile App**: Thông qua Metro bundler (exp://[YOUR_LOCAL_IP]:[PORT])

---

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 🆘 Troubleshooting

### Backend Issues

- **MongoDB Connection Error**: Kiểm tra `MONGODB_URI`
- **Port Already in Use**: Thay đổi `PORT` hoặc kill process
- **Dependencies Error**: Xóa `node_modules` và chạy lại `npm install`

### Frontend Issues

- **API Connection Error**: Kiểm tra `API_BASE_URL` hoặc `VITE_API_BASE_URL`
- **Expo Error**: Đảm bảo Expo CLI đã được cài đặt
- **Metro Bundler Error**: Dọn cache với `npx expo start -c`

### General Issues

- **Node.js Version**: >= v16
- **Network Issues**: Kiểm tra firewall và mạng nội bộ
- **Environment Variables**: Đảm bảo `.env` đúng và đầy đủ

---

## 📞 Support Contact

- **Email**: aohkne@gmail.com
- **GitHub Issues**: https://github.com/Aohkne/CaloCook/issues
- **Project Repository**: https://github.com/Aohkne/CaloCook
