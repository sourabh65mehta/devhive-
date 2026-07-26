# DevHive — Developer Q&A Platform

DevHive is a full-stack developer Q&A platform engineered for asking technical questions, attaching code screenshots/diagrams, and collaborating on answers. 

This repository features a production-ready **Node.js + Express.js + PostgreSQL** RESTful API backend built with robust security, token rotation, database pooling, image upload handling, and Zod input validation.

---

## 🚀 Key Features & Backend Architecture

- **Custom JWT Authentication System**: Dual-token architecture using short-lived Access Tokens (15 min) and long-lived Refresh Tokens (7 days).
- **Flexible Token Transport**: `authMiddleware` supports both **HTTP-only Cookies** (for browser frontend XSS security) and **Bearer Authorization Headers** (for API clients, cURL, and mobile apps).
- **Database Connection Pooling**: Built on **PostgreSQL** using `pg` Pool for efficient, non-blocking asynchronous database operations.
- **Media Upload Pipeline**: Integrated **Multer** and **Cloudinary** for seamless image upload and cloud storage for question/answer attachments.
- **Strict Input Validation**: End-to-end payload verification using **Zod** schemas.
- **Centralized Error & Response Handling**:
  - `ApiError`: Extended `Error` class for consistent HTTP status codes and error messages.
  - `ApiResponse`: Standardized JSON payload formatter across all endpoints.
  - `Asynchandler`: Wrapper function eliminating verbose `try-catch` boilerplate in controllers.
- **Global Error Handling Middleware**: Catches runtime errors gracefully and formats production error responses.

---

## 🛠 Tech Stack

### **Backend**
- **Runtime**: Node.js (ES Modules `"type": "module"`)
- **Framework**: Express.js v5
- **Database**: PostgreSQL (Neon Serverless Postgres)
- **ORM / Driver**: `pg` (PostgreSQL Client)
- **Validation**: Zod schema validator
- **Auth & Hashing**: JSON Web Tokens (`jsonwebtoken`), `bcrypt`
- **File Uploads**: `multer`, `cloudinary`
- **Security & Utilities**: `cookie-parser`, `cors`, `dotenv`

### **Frontend**
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios with automatic token refresh interceptors
- **Icons & Toasts**: Lucide React, React Hot Toast

---

## 🗄 Database Schema (PostgreSQL)

### 1. `users` Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `questions` Table
```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. `answers` Table
```sql
CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  body TEXT NOT NULL,
  image_url TEXT,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. `refresh_tokens` Table
```sql
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL
);
```

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Protection | Description | Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account | `{ username, email, password }` |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue tokens | `{ email, password }` |
| `POST` | `/api/auth/logout` | Protected | Clear session & remove refresh token | `{ refresh_token }` |
| `POST` | `/api/auth/refresh-token` | Public | Issue new access token | `{ refresh_token }` |

### ❓ Questions (`/api/questions`)
| Method | Endpoint | Protection | Description | Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/questions` | Public | Get all questions (paginated) | `?page=1&limit=10` |
| `GET` | `/api/questions/:id` | Public | Get single question details | None |
| `POST` | `/api/questions` | Protected | Create question (Multipart) | `title`, `body`, `image` (file) |
| `PATCH` | `/api/questions/:id` | Protected (Owner) | Update question (Multipart) | `title`, `body`, `image` (file) |
| `DELETE` | `/api/questions/:id` | Protected (Owner) | Delete question | None |

### 💬 Answers (`/api/answers`)
| Method | Endpoint | Protection | Description | Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/answers/question/:questionId` | Protected | Get all answers for a question | `?page=1&limit=10` |
| `GET` | `/api/answers/:answerId` | Protected | Get single answer details | None |
| `POST` | `/api/answers/:questionId` | Protected | Post answer (Multipart) | `body`, `image` (file) |
| `PATCH` | `/api/answers/:answerId` | Protected (Owner) | Update answer (Multipart) | `body`, `image` (file) |
| `DELETE` | `/api/answers/:answerId` | Protected (Owner) | Delete answer | None |

---

## ⚙️ Environment Variables Setup

Create a `.env` file inside the `Backend` directory:

```env
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>?sslmode=require

ACCESS_TOKEN_SECRET=your_super_secret_access_key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
REFRESH_TOKEN_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CORS_ORIGIN=http://localhost:5173
```

---

## ⚡ Local Installation & Development Guide

### 1. Clone & Setup Repository
```bash
git clone https://github.com/sourabh65mehta/devhive-.git
cd devhive-
```

### 2. Start Backend Server
```bash
cd Backend
npm install
npm run dev
```
*Backend server will start on `http://localhost:3000`*

### 3. Start Frontend Client
```bash
cd ../Frontend/devhive
npm install
npm run dev
```
*Frontend client will start on `http://localhost:5173`*

---

## 🌐 Production Deployment

- **Backend**: Hosted on [Render](https://render.com) (Root directory: `Backend`, Start command: `node index.js`).
- **Frontend**: Hosted on [Vercel](https://vercel.com) (Root directory: `Frontend/devhive`, Framework: `Vite`).

---

## 👨‍💻 Author

Engineered by **Sourabh Mehta**. Designed with modern backend engineering practices, PostgreSQL data modeling, and clean security principles.
