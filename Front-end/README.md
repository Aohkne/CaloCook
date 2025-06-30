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
├── 📁 app/ # Ứng dụng di động React Native
│   ├── 📁 .expo/ # Tệp cấu hình Expo
│   ├── 📁 .vscode/ # Cài đặt không gian làm việc của VS Code
│   ├── 📁 node_modules/ # Các gói đã cài đặt cho ứng dụng di động
│   ├── 📁 src/ # Mã nguồn của ứng dụng di động
│   │   ├── 📁 assets/ # Hình ảnh, phông chữ và các tệp tĩnh khác
│   │   ├── 📁 components/ # Các thành phần UI có thể tái sử dụng
│   │   ├── 📁 contexts/ # React Context cho quản lý state
│   │   ├── 📁 navigation/ # Cấu hình điều hướng
│   │   ├── 📁 redux/ # Redux store và reducers
│   │   ├── 📁 screens/ # Các màn hình/trang của ứng dụng
│   │   ├── 📁 services/ # Gọi API và các dịch vụ bên ngoài
│   │   ├── 📁 styles/ # Stylesheet và theme configuration
│   │   └── 📁 utils/ # Các hàm tiện ích
|   |
│   ├── 📄 .env # Biến môi trường cho ứng dụng di động
│   ├── 📄 .env.example # Mẫu biến môi trường
│   ├── 📄 .gitignore # Quy tắc bỏ qua của Git
│   ├── 📄 .prettierrc # Cấu hình Prettier
│   ├── 📄 App.js # Thành phần chính của ứng dụng
│   ├── 📄 app.json # Cấu hình ứng dụng Expo
│   ├── 📄 babel.config.js # Cấu hình Babel
│   ├── 📄 index.js # Điểm bắt đầu của React Native
│   ├── 📄 metro.config.js # Cấu hình bộ đóng gói Metro
│   ├── 📄 package.json # Các gói phụ thuộc và script
│   └── 📄 package-lock.json # Phiên bản phụ thuộc được khóa
│
├── 📁 web/  # Ứng dụng web quản trị sử dụng React + Vite
│    ├── 📁 node_modules/         # Các gói npm cài đặt
│    ├── 📁 public/               # Thư mục chứa các tệp tĩnh như favicon, ảnh public
│    ├── 📁 src/                  # Mã nguồn chính của ứng dụng web
│    │   ├── 📁 api/             # Gọi API và các service liên quan
│    │   ├── 📁 assets/          # Hình ảnh, phông chữ, v.v...
│    │   ├── 📁 components/      # Các component UI có thể tái sử dụng
│    │   ├── 📁 pages/           # Các trang chính của ứng dụng (như Home, Login,...)
|    |
│    ├── 📄 .env                 # Biến môi trường (được ignore khi push code)
│    ├── 📄 .env.example         # File mẫu cho biến môi trường
│    ├── 📄 .gitignore           # File để loại trừ file/thư mục khi push Git
│    ├── 📄 eslint.config.js     # Cấu hình linting
│    ├── 📄 index.html           # HTML gốc của ứng dụng web
│    ├── 📄 vite.config.js       # Cấu hình Vite
│    ├── 📄 package.json         # Danh sách dependency và script
│    └── 📄 package-lock.json    # Phiên bản cố định của dependency
```
