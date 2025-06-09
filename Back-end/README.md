## 🛠️ Technology Stack

| Technology                                                                                                     | Description                    |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)     | JavaScript runtime for backend |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | Minimalist web framework       |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)       | NoSQL document database        |
| ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)       | API documentation and testing  |

## 📂 Project Structure

```
📁 Back-end
│
├── 📁 node_modules/ # Thư mục chứa các package đã cài
│
├── 📁 src/ # Source code chính
│ ├── 📁 config/ # Cấu hình app, DB, environment, swagger
│ ├── 📁 controllers/ # Xử lý request, response
│ ├── 📁 middlewares/ # Middleware custom
│ ├── 📁 models/ # Định nghĩa schema MongoDB
│ ├── 📁 routes/ # Định nghĩa các route API
│ ├── 📁 services/ # Business logic
│ ├── 📁 utils/ # Các hàm tiện ích dùng chung
│ ├── 📁 validations/ # Validate dữ liệu đầu vào
│ └── 📄 server.js # Entry point chạy server
│
├── 📄 .babelrc # Cấu hình Babel
├── 📄 .env # Biến môi trường (bảo mật)
├── 📄 .env.example # Mẫu file `.env` để setup
├── 📄 .eslintrc.cjs # Cấu hình ESLint
├── 📄 .gitignore # File/folder không được push lên Git
├── 📄 .prettierrc # Cấu hình Prettier
├── 📄 jsconfig.json # Hỗ trợ alias path
├── 📄 LICENSE # Giấy phép mã nguồn
├── 📄 package.json # Thông tin dự án và dependencies
├── 📄 package-lock.json # Khóa version chính xác
├── 📄 settings.json # Cài đặt riêng cho môi trường dev
└── 📄 README.md # Tài liệu hướng dẫn sử dụng
```
