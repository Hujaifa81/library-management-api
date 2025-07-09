# 📚 Library Management API

A RESTful Library Management System built with **Express**, **TypeScript**, **MongoDB**, and **Mongoose**. This project includes features for managing books and borrowing logic with validation, business rules, aggregation, and proper error handling.

---

## 🚀 Features

- ✅ **Create, Read, Update, Delete (CRUD)** operations for Books
- ✅ **Borrow books** with stock management logic
- ✅ **Business rule**: Automatically toggle book availability based on stock
- ✅ **Filtering**, **sorting**, and **limit**
- ✅ **Zod-based validation** for request bodies
- ✅ **Mongoose static methods** for logic encapsulation
- ✅ **Mongoose middleware** (post hook) for auto-updating availability
- ✅ **Aggregation pipeline** for borrowed books summary
- ✅ Well-structured error responses

---

## 🔧 Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Validation**: Zod
- **Tooling**: dotenv

---

## 📦 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Hujaifa81/library-management-api.git
cd library-management-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add:

```env
NODE_ENV=development
PORT=5000
DB=mongodb+srv://<username>:<password>@cluster0.mongodb.net/library_management
```

### 4. Run the Server

```bash
npm run dev
```

---

## 🔄 API Endpoints

### 📚 Books

#### Create Book

`POST /api/books`

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

#### Get All Books with Filters

`GET /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

#### Get Book by ID

`GET /api/books/:bookId`

#### Update Book

`PUT /api/books/:bookId`

```json
{
  "copies": 10
}
```

> 📌 *Post-hook checks if `copies === 0`, sets `available = false`, otherwise true.*

#### Delete Book

`DELETE /api/books/:bookId`

---

### 📖 Borrow

#### Borrow a Book

`POST /api/borrow`

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

> 🔒 *Business logic ensures enough copies are available.*
>
> ⚙️ *Implements a **static method** to deduct copies before borrow.*

#### Borrow Summary (Aggregation)

`GET /api/borrow`

Returns total quantity borrowed per book (title & ISBN):

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    }
  ]
}
```

---

## ⚙️ Advanced Implementation Details

### ✅ Zod Schema Validation

All incoming requests (create/update book, borrow) are validated using **Zod**, ensuring clean, safe, and structured inputs.

### 🧠 Mongoose Static Method

`Borrow.deductRequestedQuantity(bookId, quantity)`  
Ensures enough stock is available before borrow. If valid, deducts stock and updates book availability.

### 🧩 Mongoose Post Middleware (Hook)

Runs **after book update**:

```ts
post("findOneAndUpdate", function(doc) {
  if (doc && doc.copies === 0) doc.available = false;
  else doc.available = true;
});
```

---

## 🚫 Error Handling

All responses follow a consistent format:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number"
      }
    }
  }
}
```

Handles:

- ❌ Zod schema errors
- ❌ MongoDB validation & duplicate errors
- ❌ 404 for not found
- ❌ 500 for internal issues

---

## 🌐 Live Demo

🔗 [https://library-management-system-neon-iota.vercel.app/](https://library-management-system-neon-iota.vercel.app/)

---

## 👨‍💻 Author

**Md Abu Hujaifa**  
Full Stack Developer  
📧 abuhojaifa123@gmail.com  
🌐 [https://md-abu-hujaifa.netlify.app/](https://md-abu-hujaifa.netlify.app/)

---

## 📄 License

MIT License – use freely with attribution