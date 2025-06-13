<p align="center">
  <img src="Front-end/app/src/assets/logo_word.png" alt="CaloCook Logo" />
</p>

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
- **Setup & Support Guide**: [SUPPORT.md](./SUPPORT.md) - Hướng dẫn cài đặt và hỗ trợ chi tiết

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

## ✨ Features

- 📱 **Cross-platform**: Web app và mobile app (iOS/Android)
- 🍽️ **Recipe Management**: Quản lý công thức nấu ăn với thông tin dinh dưỡng
- 📊 **Calorie Tracking**: Theo dõi lượng calo tiêu thụ hàng ngày
- 🔄 **Auto Reset**: Tự động reset dữ liệu hàng ngày
- 📝 **Personal Dish List**: Danh sách món ăn cá nhân hóa
- 📈 **Progress Monitoring**: Theo dõi tiến trình ăn uống lành mạnh

## 🚀 Quick Start

1. **Setup Backend & Frontend**: Xem chi tiết trong [SUPPORT.md](./SUPPORT.md)
2. **Access Applications**:
   - API Documentation: http://localhost:8080/api-docs
   - Web App: http://localhost:3000
   - Mobile App: Scan QR code từ Expo CLI

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
- **Support**: Xem [SUPPORT.md](./SUPPORT.md) để được hỗ trợ kỹ thuật

### 🌟 Star Us on GitHub!

If you find this project useful, please consider giving it a star ⭐ on GitHub to help others discover it.

[![GitHub stars](https://img.shields.io/github/stars/Aohkne/CaloCook?style=social)](https://github.com/Aohkne/CaloCook)
[![GitHub forks](https://img.shields.io/github/forks/Aohkne/CaloCook?style=social)](https://github.com/Aohkne/CaloCook/fork)
[![GitHub watchers](https://img.shields.io/github/watchers/Aohkne/CaloCook?style=social)](https://github.com/Aohkne/CaloCook)
