# 🍳 CaloCook
Track your daily calories through every homemade dish 

## 🎯 Overview
**CaloCook** is an application that helps users track their daily calorie intake through home-cooked meals. Users can add dishes to their personal list based on pre-stored recipes. Each recipe includes an estimated calorie count. When users choose to prepare that dish, the application will automatically add the calories to the total calories consumed for the day. At the end of the day, the system will automatically reset to start a new cycle, making it easy for users to control and build a healthy diet.

## 📚 Documentation
- **API Documentation**: Truy cập Swagger UI tại `http://localhost:8080/api-docs` khi server đang chạy
- **Project Backlog**: [Google Sheets](https://docs.google.com/spreadsheets/d/1qZQSl7nGFBgQ8uewTWSyrrD1jEJE7PI_dfjwzR5SLhw/edit?usp=sharing) - Chi tiết các tính năng và task
- **UI/UX Design**: [Figma](https://www.figma.com/design/jEj7bKpg4Smo76bZdOhn67/Diet?t=Ti6E9dWskcX1FDG0-0) - Mockup và design system  
- **Database Schema**: [DB Diagram](https://dbdiagram.io/d/CaloCook-Diagram-6846e9d49d13e984f7c73e68) - Thiết kế cơ sở dữ liệu
- **Final Documentation**: [Google Docs](https://docs.google.com/document/d/1a32SBriBL02bUEA6Ysl-95G0fvPRHgltR84ZnlGxYxg/edit?usp=sharing) - Tài liệu tổng hợp dự án

## 🛠️ Technology Stack

### Backend
| Technology | Description |
|------------|-------------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) | JavaScript runtime for backend |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | Minimalist web framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) | NoSQL document database |
| ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black) | API documentation and testing |

### Frontend
| Technology | Description |
|------------|-------------|
| ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | Cross-platform mobile framework for app |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | Fast build tool for web development |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | JavaScript library for web UI |
| ![Expo Go](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white) | Development platform for React Native |

## 📂 Project Structure

```
📁 CaloCook
│
├── 📁 Back-end/                    # Server-side application
│   ├── 📁 node_modules/            # Thư mục chứa các package đã cài
│   │
│   ├── 📁 src/                     # Source code chính
│   │   ├── 📁 config/              # Cấu hình app, DB, environment, swagger
│   │   ├── 📁 controllers/         # Xử lý request, response
│   │   ├── 📁 middlewares/         # Middleware custom
│   │   ├── 📁 models/              # Định nghĩa schema MongoDB
│   │   ├── 📁 routes/              # Định nghĩa các route API
│   │   ├── 📁 services/            # Business logic
│   │   ├── 📁 utils/               # Các hàm tiện ích dùng chung
│   │   ├── 📁 validations/         # Validate dữ liệu đầu vào
│   │   └── 📄 server.js            # Entry point chạy server
│   │
│   ├── 📄 .babelrc                 # Cấu hình Babel
│   ├── 📄 .env                     # Biến môi trường (bảo mật)
│   ├── 📄 .env.example             # Mẫu file `.env` để setup
│   ├── 📄 .eslintrc.cjs            # Cấu hình ESLint
│   ├── 📄 .gitignore               # File/folder không được push lên Git
│   ├── 📄 .prettierrc              # Cấu hình Prettier
│   ├── 📄 jsconfig.json            # Hỗ trợ alias path
│   ├── 📄 LICENSE                  # Giấy phép mã nguồn
│   ├── 📄 package.json             # Thông tin dự án và dependencies
│   ├── 📄 package-lock.json        # Khóa version chính xác
│   ├── 📄 settings.json            # Cài đặt riêng cho môi trường dev
│   └── 📄 README.md                # Tài liệu hướng dẫn sử dụng
│
└── 📁 Front-end/                   # Client-side applications
    │
    ├── 📁 app/                     # Ứng dụng di động React Native
    │   ├── 📁 .expo/               # Tệp cấu hình Expo
    │   ├── 📁 .vscode/             # Cài đặt không gian làm việc của VS Code
    │   ├── 📁 node_modules/        # Các gói đã cài đặt cho ứng dụng di động
    │   ├── 📁 src/                 # Mã nguồn của ứng dụng di động
    │   │   ├── 📁 assets/          # Hình ảnh, phông chữ và các tệp tĩnh khác
    │   │   ├── 📁 components/      # Các thành phần UI có thể tái sử dụng
    │   │   ├── 📁 contexts/        # React Context cho quản lý state
    │   │   ├── 📁 navigation/      # Cấu hình điều hướng
    │   │   ├── 📁 redux/           # Redux store và reducers
    │   │   ├── 📁 screens/         # Các màn hình/trang của ứng dụng
    │   │   ├── 📁 services/        # Gọi API và các dịch vụ bên ngoài
    │   │   ├── 📁 styles/          # Stylesheet và theme configuration
    │   │   └── 📁 utils/           # Các hàm tiện ích
    │   │
    │   ├── 📄 .env                 # Biến môi trường cho ứng dụng di động
    │   ├── 📄 .env.example         # Mẫu biến môi trường
    │   ├── 📄 .gitignore           # Quy tắc bỏ qua của Git
    │   ├── 📄 .prettierrc          # Cấu hình Prettier
    │   ├── 📄 App.js               # Thành phần chính của ứng dụng
    │   ├── 📄 app.json             # Cấu hình ứng dụng Expo
    │   ├── 📄 babel.config.js      # Cấu hình Babel
    │   ├── 📄 index.js             # Điểm bắt đầu của React Native
    │   ├── 📄 metro.config.js      # Cấu hình bộ đóng gói Metro
    │   ├── 📄 package.json         # Các gói phụ thuộc và script
    │   └── 📄 package-lock.json    # Phiên bản phụ thuộc được khóa
    │
    └── 📁 web/                     # Ứng dụng web React (Vite)
        ├── 📁 node_modules/        # Các gói đã cài đặt cho ứng dụng web
        ├── 📁 public/              # Tệp tĩnh công khai
        ├── 📁 src/                 # Mã nguồn của ứng dụng web
        │   ├── 📁 assets/          # Hình ảnh, phông chữ và các tệp tĩnh
        │   ├── 📁 components/      # Các thành phần UI có thể tái sử dụng
        │   ├── 📁 pages/           # Các trang của ứng dụng web
        │   ├── 📁 hooks/           # Custom React hooks
        │   ├── 📁 services/        # Gọi API và các dịch vụ
        │   ├── 📁 styles/          # CSS và SCSS files
        │   └── 📁 utils/           # Các hàm tiện ích
        │
        ├── 📄 .env                 # Biến môi trường cho ứng dụng web
        ├── 📄 .env.example         # Mẫu biến môi trường
        ├── 📄 .gitignore           # Quy tắc bỏ qua của Git
        ├── 📄 index.html           # HTML template chính
        ├── 📄 package.json         # Các gói phụ thuộc và script
        ├── 📄 package-lock.json    # Phiên bản phụ thuộc được khóa
        └── 📄 vite.config.js       # Cấu hình Vite
```

## ⚙️ Environment Variables

### Backend (.env)
```bash
AUTHOR=''
MONGODB_URI=''
DATABASE_NAME=''
HOST=''
PORT=''
```

### Frontend App (.env)
```bash
# API Configuration
API_BASE_URL=''
API_TIMEOUT=''

# Environment
NODE_ENV=''

# Expo Configuration (if needed)
EXPO_PUBLIC_API_URL=''
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

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team
- **Backend Developers**:
  - Lê Hữu Khoa - CE181099
  - Nguyễn Gia Chấn - CE181288
  - Nguyễn Gia Bảo - CE180908
- **Frontend Developer**:
  - Nguyễn Trọng Quý - CE180596
- **Mobile Developers**:
  - Lê Hữu Khoa - CE181099
  - Nguyễn Thanh Bảo - CE181098
  - Nguyễn Trọng Quý - CE180596

## 📞 Contact
- **Email**: aohkne@gmail.com
- **GitHub**: https://github.com/Aohkne/CaloCook
- **Project Repository**: https://github.com/Aohkne/CaloCook

### 🌟 Star Us on GitHub!
If you find this project useful, please consider giving it a star ⭐ on GitHub to help others discover it.

[![GitHub stars](https://img.shields.io/github/stars/Aohkne/CaloCook?style=social)](https://github.com/Aohkne/CaloCook)
[![GitHub forks](https://img.shields.io/github/forks/Aohkne/CaloCook?style=social)](https://github.com/Aohkne/CaloCook/fork)
[![GitHub watchers](https://img.shields.io/github/watchers/Aohkne/CaloCook?style=social)](https://github.com/Aohkne/CaloCook)
