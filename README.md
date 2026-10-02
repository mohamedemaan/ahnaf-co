# 🛍️ Ahnaf & Co - Modern eCommerce Platform

Welcome to **Ahnaf & Co**, a fully functional, full-stack modern eCommerce platform built with the MERN stack (MongoDB, Express, React, Node.js). 

This project features a beautiful, responsive UI/UX with smooth animations, dual frontend applications (User App & Admin Dashboard), and a robust backend.

## ✨ Features

### 🛒 User Experience (Frontend)
- **Beautiful Modern UI:** Designed with Tailwind CSS featuring a clean slate & teal aesthetic.
- **Smooth Animations:** Powered by Framer Motion for seamless page transitions and interactive elements.
- **Product Discovery:** Search functionality and category-based browsing.
- **Dynamic Product Pages:** View product details, image galleries, and real-time average user ratings & reviews.
- **Shopping Cart:** Add, remove, and manage quantities in a dynamic shopping cart.
- **Checkout Flow:** Interactive multi-step checkout process with Cash on Delivery (COD).
- **Order History:** View past orders and expand to see ordered items.

### ⚙️ Admin Dashboard
- **Separate Admin Portal:** Runs entirely independently from the User application for enhanced security.
- **Product Management:** Full CRUD (Create, Read, Update, Delete) capabilities for products.
- **Bulk Operations:** Select multiple products and perform bulk deletions.

### 🛡️ Backend & Database
- **RESTful API:** Built with Node.js and Express.
- **Database:** MongoDB with Mongoose object modeling.
- **Authentication:** Secure JWT-based authentication for users.
- **Structured Schemas:** Dedicated schemas for Users, Products, Orders, Cart, and Reviews.

## 🚀 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Axios, React Router Dom
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

## 🛠️ Installation & Setup

To run this project locally, you will need Node.js and MongoDB installed on your machine.

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd ecommerce-project
```

### 2. Setup the Backend
Open a terminal and navigate to the server folder:
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your MongoDB connection string and JWT Secret:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
Start the backend server:
```bash
npm start
```
*The backend will run on `http://localhost:5000`*

### 3. Setup the User Frontend
Open a new terminal and navigate to the client folder:
```bash
cd client/client
npm install
npm run dev
```
*The User App will run on `http://localhost:5173`*

### 4. Setup the Admin Dashboard (Optional)
If you have the admin portal setup, navigate to its folder in a new terminal:
```bash
cd client/admin   # (Adjust path to your specific admin folder)
npm install
npm run dev
```
*The Admin App will run on `http://localhost:5174`*

## 📦 Project Structure

```
ecommerce-project/
├── server/               # Node.js + Express Backend
│   ├── config/           # Database config
│   ├── controllers/      # Route controllers (logic)
│   ├── models/           # Mongoose Database Schemas
│   └── routes/           # Express API Routes
│
├── client/
│   ├── client/           # User Facing React App
│   │   ├── src/
│   │   │   ├── components/ # Reusable UI components (Navbar, Layouts)
│   │   │   └── pages/      # Main application pages (Home, Cart, Orders, Product Details)
│   │
│   └── admin/            # Admin Dashboard React App
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is open source and available under the [MIT License](LICENSE).
