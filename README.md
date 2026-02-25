# Rupkala — Custom T-Shirt E-Commerce Platform

> *रूपकला — Art of Form*

**Wear Your Story.** Rupkala is a full-stack, human-centered e-commerce platform for custom printed t-shirts. Built as a university major project using the MERN stack.

---

## 🗂 Project Structure

```
rupkala/
├── client/          # React + Tailwind frontend (Vite)
├── server/          # Node.js + Express REST API
└── docs/            # University documentation
```

---

## ⚡ Quick Start

### Prerequisites

| Tool       | Version Required |
|------------|-----------------|
| Node.js    | v18+            |
| npm        | v9+             |
| MongoDB    | v6+ (local) or Atlas URI |

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/rupkala.git
cd rupkala
```

### 2. Set up the Backend

```bash
cd server
npm install

# Create your .env file
cp .env.example .env
# Open .env and fill in your MONGO_URI and JWT_SECRET
```

Edit `server/.env`:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/rupkala
JWT_SECRET=your_strong_secret_here_at_least_32_chars
JWT_EXPIRES_IN=7d
```

Start the backend:
```bash
npm run dev
# Server will start at http://localhost:5000
```

### 3. Set up the Frontend

```bash
cd ../client
npm install
npm run dev
# React app will start at http://localhost:5173
```

### 4. Open in browser

Navigate to **http://localhost:5173**

---

## 🌱 Seed Sample Data

You can manually add products via the Admin Panel (after creating an admin user) or via the API:

**Create an admin user** — after registering normally, update their role in MongoDB:
```js
// In MongoDB shell or Compass
db.users.updateOne({ email: "admin@rupkala.com" }, { $set: { role: "admin" } })
```

---

## 🔑 API Endpoints

| Method | Route                          | Auth     | Description                |
|--------|-------------------------------|----------|----------------------------|
| POST   | /api/auth/register            | Public   | Register new user          |
| POST   | /api/auth/login               | Public   | Login, get JWT             |
| GET    | /api/auth/me                  | Private  | Get current user           |
| GET    | /api/products                 | Public   | Get all products           |
| GET    | /api/products/featured        | Public   | Get featured products      |
| GET    | /api/products/:id             | Public   | Get product by ID/slug     |
| POST   | /api/products/:id/reviews     | Private  | Add review                 |
| POST   | /api/orders                   | Private  | Place an order             |
| GET    | /api/orders/myorders          | Private  | Get user's orders          |
| POST   | /api/orders/:id/pay           | Private  | Simulate payment           |
| POST   | /api/designs                  | Private  | Save custom design         |
| GET    | /api/designs/mine             | Private  | Get user's saved designs   |
| GET    | /api/admin/stats              | Admin    | Dashboard statistics       |
| POST   | /api/admin/products           | Admin    | Create product             |
| PUT    | /api/admin/products/:id       | Admin    | Update product             |
| DELETE | /api/admin/products/:id       | Admin    | Deactivate product         |
| GET    | /api/admin/orders             | Admin    | Get all orders             |
| PUT    | /api/admin/orders/:id/status  | Admin    | Update order status        |
| GET    | /api/admin/users              | Admin    | Get all users              |

---

## 🏛 Architecture

```
React Client (Vite + Tailwind)
        ↓ HTTP / Axios
Express REST API (Node.js)
        ↓ Mongoose ODM
MongoDB Database
```

**Pattern:** MVC (Model → Controller → Route)  
**Auth:** JWT Bearer tokens  
**State:** React Context API (Auth + Cart)  
**Uploads:** Multer → local /uploads (upgrade to S3 for production)  

---

## 🧩 Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS 3     |
| Backend    | Node.js, Express.js                |
| Database   | MongoDB, Mongoose                  |
| Auth       | JWT (jsonwebtoken), bcryptjs       |
| File Upload| Multer                             |
| Routing    | React Router DOM v6                |
| HTTP Client| Axios                              |
| Toasts     | React Hot Toast                    |
| Icons      | React Icons (Feather)              |

---

## 🎨 Brand Design System

| Token         | Value                  |
|---------------|------------------------|
| Primary       | `#f97316` (Orange 500) |
| Ink (dark)    | `#1a1a2e`              |
| Background    | `#fef9f0` (Warm cream) |
| Font: Display | Playfair Display       |
| Font: Body    | Inter                  |
| Font: Accent  | Space Grotesk          |

---

## 👨‍💻 Developer Notes

- All controllers are modular and independently testable
- Cart persists in `localStorage` between sessions
- Auth token stored in `localStorage` and attached globally via Axios interceptors
- Admin routes are double-guarded (JWT + role check)
- Soft-delete used for products (isActive flag) to preserve order history integrity
- Order numbers auto-generated in format `RK-YYYYMMDD-NNNN`

---

## 📄 License

This project was created for academic purposes at [Your University Name].  
© 2024 [Your Name]. All rights reserved.
