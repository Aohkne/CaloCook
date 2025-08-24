## 🛠️ Technology Stack

| Technology                                                                                                        | Description                             |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | Cross-platform mobile framework for app |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)                   | Fast build tool for web development     |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)               | JavaScript library for web UI           |
| ![Expo Go](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)                | Development platform for React Native   |

## 📂 Project Structure

```
📁 Front-end
│
├── 📁 app/                         # Ứng dụng di động React Native
│   ├── 📁 .expo/                   # Tệp cấu hình Expo
│   ├── 📁 .vscode/                 # Cài đặt không gian làm việc của VS Code
│   ├── 📁 node_modules/            # Các gói đã cài đặt cho ứng dụng di động
│   ├── 📁 src/                     # Mã nguồn của ứng dụng di động
│   │   ├── 📁 assets/              # Hình ảnh, phông chữ và các tệp tĩnh khác
│   │   ├── 📁 components/          # Các thành phần UI có thể tái sử dụng
│   │   ├── 📁 contexts/            # React Context cho quản lý state
│   │   ├── 📁 navigation/          # Cấu hình điều hướng
│   │   ├── 📁 redux/               # Redux store và reducers
│   │   ├── 📁 screens/             # Các màn hình/trang của ứng dụng
│   │   ├── 📁 services/            # Gọi API và các dịch vụ bên ngoài
│   │   ├── 📁 styles/              # Stylesheet và theme configuration
│   │   └── 📁 utils/               # Các hàm tiện ích
|   |
│   ├── 📄 .env                     # Biến môi trường cho ứng dụng di động
│   ├── 📄 .env.example             # Mẫu biến môi trường
│   ├── 📄 .gitignore               # Quy tắc bỏ qua của Git
│   ├── 📄 .prettierrc              # Cấu hình Prettier
│   ├── 📄 App.js                   # Thành phần chính của ứng dụng
│   ├── 📄 app.json                 # Cấu hình ứng dụng Expo
│   ├── 📄 babel.config.js          # Cấu hình Babel
│   ├── 📄 index.js                 # Điểm bắt đầu của React Native
│   ├── 📄 metro.config.js          # Cấu hình bộ đóng gói Metro
│   ├── 📄 package.json             # Các gói phụ thuộc và script
│   └── 📄 package-lock.json        # Phiên bản phụ thuộc được khóa
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
