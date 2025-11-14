<p align="center">
  <img src="Front-end/app/src/assets/logo_word.png" alt="CaloCook Logo" />
</p>

# 🍳 CaloCook

Track your daily calories through every homemade dish

## 🎯 Overview

**CaloCook** is an application that helps users track their daily calorie intake through home-cooked meals. Users can add dishes to their personal list based on pre-stored recipes. Each recipe includes an estimated calorie count. When users choose to prepare that dish, the application will automatically add the calories to the total calories consumed for the day. At the end of the day, the system will automatically reset to start a new cycle, making it easy for users to control and build a healthy diet.

## 🎬 Demo Video

Watch our introduction video to see Mer in action:

[![CaloCook Introduction Video]()]()

_Click the image above to watch the full demo on YouTube_

## 📚 Documentation

- **API Documentation**: Truy cập Swagger UI tại `http://localhost:8080/api-docs` khi server đang chạy
- **Project Backlog**: [Google Sheets](https://docs.google.com/spreadsheets/d/1oTjKqkMeS-sp5jDHDS2CM_Mzts-6Y1MU/edit?usp=sharing&ouid=103845613501192788324&rtpof=true&sd=true) - Chi tiết các tính năng và task
- **UI/UX Design**: [Figma](https://www.figma.com/design/jEj7bKpg4Smo76bZdOhn67/Diet?t=Ti6E9dWskcX1FDG0-0) - Mockup và design system
- **Database Schema**: [DB Diagram](https://dbdiagram.io/d/CaloCook-Diagram-6846e9d49d13e984f7c73e68) - Thiết kế cơ sở dữ liệu
- **Support Documentation**: [Google Docs](https://docs.google.com/document/d/1a32SBriBL02bUEA6Ysl-95G0fvPRHgltR84ZnlGxYxg/edit?usp=sharing) - Tài liệu hỗ trợ dự án
- **Final Documentation**: [Google Docs](https://docs.google.com/document/d/1WXCNHv66_Zyw1ooD9ZfQqYt4JVax7wq1/edit?usp=sharing&ouid=103845613501192788324&rtpof=true&sd=true) - Tài liệu tổng hợp dự án
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
└── 📁 Front-end
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
    |   |
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
    ├── 📁 web/                               # Ứng dụng web quản trị sử dụng React + Vite
    |   ├── 📁 .vscode/                       # Cấu hình riêng cho VS Code
    |   ├── 📁 node_modules/                  # Thư viện phụ thuộc đã cài đặt
    |   ├── 📁 public/                        # Tài nguyên tĩnh, không qua xử lý Vite
    |   ├── 📁 src/                           # Mã nguồn chính của ứng dụng web
    |   │   ├── 📁 api/                       # Định nghĩa các request API
    |   │   ├── 📁 assets/                    # Tài nguyên tĩnh cần bundle
    |   │   ├── 📁 components/                # Các thành phần UI có thể tái sử dụng
    |   │   │   ├── 📁 sections/              # Các section lớn (Header, Footer, Sidebar…)
    |   │   │   └── 📁 ui/                    # Thành phần UI nhỏ (Button, Input, Modal…)
    |   │   ├── 📁 constants/                 # Các hằng số
    |   │   ├── 📁 contexts/                  # React Context (Theme, Auth, Language…)
    |   │   ├── 📁 hooks/                     # Custom hooks
    |   │   ├── 📁 pages/                     # Các trang chính
    |   │   │   ├── 📁 (admin)/               # Trang cho admin
    |   │   │   ├── 📁 (user)/                # Trang cho user
    |   │   ├── 📁 routes/                    # Định nghĩa route React Router
    |   │   ├── 📁 styles/                    # SCSS/CSS
    |   │   ├── 📁 utils/                     # Hàm tiện ích
    |   │   ├── 📄 App.jsx                    # Thành phần gốc của ứng dụng
    |   │   └── 📄 main.jsx                   # Điểm khởi đầu
    |   |
    |   ├── 📄 .env                           # Biến môi trường
    |   ├── 📄 .env.example                   # Template biến môi trường để tham khảo
    |   ├── 📄 .gitignore                     # Quy tắc loại trừ khi commit Git
    |   ├── 📄 .prettierrc                    # Cấu hình Prettier
    |   ├── 📄 eslint.config.js               # Cấu hình ESLint
    |   ├── 📄 index.html                     # File HTML gốc, mount React app
    |   ├── 📄 jsconfig.json                  # Cấu hình alias cho import
    |   ├── 📄 package-lock.json              # Phiên bản chính xác của dependency
    |   ├── 📄 package.json                   # Thông tin dự án + script npm
    |   └── 📄 vite.config.js                 # Cấu hình Vite (alias, plugins…)
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

## 👥 Team

- **Backend Developers**:
  - Lê Hữu Khoa - CE181099
  - Nguyễn Gia Chấn - CE181288
  - Nguyễn Gia Bảo - CE180908
- **Frontend Developer**:
  - Lê Hữu Khoa - CE181099
  - Nguyễn Thanh Bảo - CE181098
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

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

### 🌟 Star Us on GitHub!

If you find this project useful, please consider giving it a star ⭐ on GitHub to help others discover it.

[![GitHub stars](https://img.shields.io/github/stars/Aohkne/CaloCook?style=social)](https://github.com/Aohkne/CaloCook)
[![GitHub forks](https://img.shields.io/github/forks/Aohkne/CaloCook?style=social)](https://github.com/Aohkne/CaloCook/fork)
[![GitHub watchers](https://img.shields.io/github/watchers/Aohkne/CaloCook?style=social)](https://github.com/Aohkne/CaloCook)
