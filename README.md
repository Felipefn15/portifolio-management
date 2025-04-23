```markdown
# 💼 Careminds Portfolio Management App

Welcome to the second phase of the Careminds technical challenge!

This project is a full-stack portfolio management application built with **Next.js** and **Node.js**. It enables users to register, log in, and manage their investment portfolios, including multiple wallets and assets. All financial data is stored securely on the backend, with dynamic calculations for balance and profit/loss.

## 📌 Project Overview

The application allows users to:

- Register and log in using email and password
- Create and manage multiple wallets
- Add, edit, and delete assets within each wallet
- View real-time calculations of asset performance and overall financial status

## 🔐 Authentication

Authentication is implemented using JWT (JSON Web Tokens). The system supports:

- User registration
- Secure login and logout
- Protection of private routes and user data

## 🧮 Financial Features

Each wallet includes:

- **Name**
- **Current balance** (calculated from assets)
- **Spent amount**
- **Profit/Loss** (based on asset performance)

Each asset includes:

- **Type** (e.g., stock, crypto)
- **Symbol**
- **Name**
- **Quantity**
- **Purchase price**
- **Current price**

The system dynamically calculates:

- Total wallet value
- Individual asset gain/loss
- Overall profit/loss for each wallet

## ⚙️ Tech Stack

- **Frontend:** React + Next.js + TailwindCSS
- **Backend:** Node.js + Next.js API Routes
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT

## 🚀 Getting Started

Follow these steps to run the project locally:

1. **Clone the repository**

```bash
git clone https://github.com/Felipefn15/portifolio-management.git
cd portifolio-management
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory and configure the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. **Run the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📁 Folder Structure

```
/pages
  /api          → Backend routes (authentication, wallets, assets)
  /auth         → Login and registration pages
  /dashboard    → User dashboard (wallets and assets)
/components     → Reusable UI components
/lib            → Utilities (e.g., DB connection, JWT helpers)
```

## ✅ Features to Test

- [ ] Register and login flow
- [ ] Wallet creation, editing, and deletion
- [ ] Asset management per wallet
- [ ] Accurate real-time calculations
- [ ] UI and protected route behavior

## 📅 Deadline

This project was delivered as part of the Careminds Phase 2 screening process. Estimated effort: 5-6 hours over 7 calendar days.

---

Feel free to reach out if you have any questions or need additional setup help!

```
