# 💰 Salary Tracker CRM Dashboard

A modern, full-stack **Salary Tracker CRM Dashboard** designed for individuals and finance administrators to manage monthly salaries, track expenses, establish category budgets, audit transactions, and analyze financial performance through interactive data visualizations.

---

## 🌟 Key Features

### 1. 📊 Executive Financial Dashboard
* **4 Core KPI Cards**: Instant visibility into Net Salary, Total Expenses, Remaining Balance, and Monthly Savings Goal progress.
* **Financial Snapshot Banner**: High-level summary with dynamic Savings Rate percentage and Largest Expense identification.
* **4 Interactive Recharts**:
  * **Monthly Expense Trend**: Area chart illustrating spending progression across months.
  * **Expenses by Category**: Donut chart with breakdown percentages and interactive category filtering.
  * **Salary vs Expenses**: Grouped bar chart comparing income against outflow.
  * **Daily Spending**: Line chart tracking daily spending behavior across the active month.
* **Real-Time Budget Widget**: Progress bars highlighting category spending with visual threshold indicators.
* **Recent Activity Feed**: Quick audit list showing latest expenses with payment methods and category tags.

### 2. 💵 Salary Management
* **Comprehensive Payroll Breakdown**: Record Base Salary, Bonus, Commission, Other Income, Tax, and Deductions.
* **Automatic Net Calculation**: Real-time Gross Income and Net Take-Home Salary computations.
* **Duplicate Previous Month**: 1-click feature to replicate past payroll settings for swift monthly setups.
* **Salary History**: Historical records table with edit and delete capabilities.

### 3. 💳 Transaction Auditing & Search
* **Income & Expense Tracking**: Record title, amount, category, payment method (UPI, Credit Card, Cash, etc.), account, notes, and dates.
* **Multi-Filter & Search Bar**: Search across descriptions, filter by category, payment method, transaction type, or amount range.
* **Pagination & Detail View**: Inspect complete transaction details in an overlay modal.
* **Export to CSV**: Download raw transaction records formatted for spreadsheets.

### 4. 🎯 Category Budgets & Smart Alerts
* **Custom Spending Limits**: Set monthly expense thresholds per category.
* **Progress Tracking**: Real-time comparison between budget limits and actual spending.
* **Threshold Warning Indicators**:
  * 🟢 **Normal**: Under 75% limit.
  * 🟡 **Caution / Warning**: 75% – 99% utilized.
  * 🔴 **Danger / Exceeded**: 100%+ spent.
* **Header Alerts Bell**: Notification center showing active budget warnings.

### 5. 📈 Month-over-Month Comparative Reports
* **Side-by-Side Comparison**: Select any two months (e.g. September vs October) to analyze percentage shifts in salary, spending, and savings.
* **Printable Statements**: Clean printable invoice-style summary layout.
* **CSV Export**: Direct export of monthly financial statements.

### 6. 🏷️ Category Management
* **Default Categories**: Pre-loaded categories (Food, Rent, Groceries, Transportation, Bills, Entertainment, etc.).
* **Custom Categories**: Create, color-tag, edit, and delete personalized categories.

### 7. ⚙️ Settings & System Health
* **User Profile**: Update profile name, phone number, and monthly savings goal.
* **Currency Formatting**: Support for **₹ (INR)**, **$ (USD)**, **€ (EUR)**, **£ (GBP)**, and **AED**.
* **Live MongoDB Status**: Real-time health badge verifying connection to MongoDB Atlas.
* **Demo Data Seeder**: 1-click database loader for PRD October 2026 data and historical periods.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons |
| **Backend** | Node.js, Express.js, Mongoose, JWT (jsonwebtoken), Bcryptjs, CORS, Dotenv |
| **Database** | MongoDB Atlas / Local MongoDB (with In-Memory MockStore fallback) |

---

## 📁 Project Architecture

The repository is organized into two completely decoupled services:

```text
salary-tracker-crm/
├── backend/                       # Express REST API Server
│   ├── config/
│   │   └── db.js                 # Resilient MongoDB connection & status tracker
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/                   # Mongoose schemas (User, Salary, Transaction, Category, Budget)
│   ├── routes/
│   │   ├── auth.js               # Login, register, profile, and status routes
│   │   ├── salaries.js           # Salary CRUD & duplicate endpoints
│   │   ├── transactions.js       # Transaction CRUD, search, filter, and pagination
│   │   ├── budgets.js            # Category budget limits & spent tracker
│   │   ├── categories.js         # Default & custom category management
│   │   ├── dashboard.js          # Aggregated KPI cards & chart endpoints
│   │   ├── reports.js            # Month-over-month comparison & CSV exporter
│   │   └── seed.js               # Database demo data seeder
│   ├── store/
│   │   └── mockStore.js          # In-memory storage fallback
│   ├── .env                      # Backend environment variables
│   ├── server.js                 # Server entry point (Port 5001)
│   └── package.json
│
├── frontend/                      # React + Vite Client Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # Sidebar, Header, MobileNav
│   │   │   ├── dashboard/        # Summary cards, banners, and 4 Recharts
│   │   │   ├── salary/           # Salary modal with gross/net calculator
│   │   │   ├── transactions/     # Transaction modal with type selector
│   │   │   └── budget/           # Budget modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state & live DB monitor
│   │   ├── pages/                # Overview, Salary, Transactions, Expenses, Budgets, Reports, Categories, Settings
│   │   ├── services/
│   │   │   └── api.js            # Centralized API client
│   │   ├── utils/                # Currency & date formatters
│   │   ├── App.jsx               # Main application shell
│   │   └── index.css             # Tailwind design tokens & animations
│   ├── index.html
│   ├── vite.config.js            # Vite config with API proxy to port 5001
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.x or later)
* [npm](https://www.npmjs.com/) (v9.x or later)
* MongoDB connection string (MongoDB Atlas cluster or local MongoDB instance)

---

### Step 1: Configure Backend

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create or verify your `.env` file inside `backend/.env`:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=salary_tracker_crm_jwt_secret_token_2026_secure
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API server will run at: **http://localhost:5001***

---

### Step 2: Configure Frontend

1. Open a **second terminal window** and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The web application will open at: **http://localhost:3000***

---

## 🔐 Default Demo Login

You can use the demo admin credentials or click the **"Quick Demo Login"** button on the sign-in screen:

* **Email:** `admin@salarytracker.com`
* **Password:** `admin123`

---

## 📡 REST API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & retrieve JWT token |
| `POST` | `/api/auth/register` | Register a new user |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `PUT` | `/api/auth/profile` | Update user preferences and savings target |
| `GET` | `/api/auth/status` | Check live MongoDB Atlas connection status |
| `GET` | `/api/salaries` | Retrieve salary records (filterable by month/year) |
| `POST` | `/api/salaries` | Create or upsert salary record |
| `PUT` | `/api/salaries/:id` | Update existing salary record |
| `DELETE` | `/api/salaries/:id` | Delete salary record |
| `POST` | `/api/salaries/duplicate-previous` | Duplicate previous month's salary into target month |
| `GET` | `/api/transactions` | Search & filter transactions with pagination |
| `POST` | `/api/transactions` | Add a new income or expense transaction |
| `PUT` | `/api/transactions/:id` | Update transaction |
| `DELETE` | `/api/transactions/:id` | Delete transaction |
| `GET` | `/api/budgets` | Fetch monthly budgets with spent progress & alerts |
| `POST` | `/api/budgets` | Set or update category budget |
| `DELETE` | `/api/budgets/:id` | Remove category budget |
| `GET` | `/api/categories` | Fetch default and custom categories |
| `POST` | `/api/categories` | Create custom category |
| `DELETE` | `/api/categories/:id` | Delete custom category |
| `GET` | `/api/dashboard/summary` | Fetch top 4 KPI cards & snapshot summary |
| `GET` | `/api/dashboard/monthly` | Fetch 6-month historical area/bar chart data |
| `GET` | `/api/dashboard/category-expenses` | Fetch category spending breakdown for donut chart |
| `GET` | `/api/dashboard/daily-expenses` | Fetch daily spending line chart data |
| `GET` | `/api/reports/compare` | Month-over-month comparative analysis |
| `GET` | `/api/reports/export-csv` | Download transactions formatted in CSV |
| `POST` | `/api/seed` | Reset / re-seed demo data for October 2026 |

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).