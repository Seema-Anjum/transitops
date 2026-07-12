# 🚛 TransitOps – Smart Transport Operations Platform

A full-stack transport and fleet management system that digitizes vehicle, driver, trip, maintenance, and expense management while providing operational insights through dashboards and analytics. The application streamlines transport operations by replacing manual processes with a centralized, role-based platform. 
The project implements the hackathon requirements for authentication, fleet management, trip lifecycle, maintenance workflows, fuel tracking, and analytics. 

---

## 🌐 Live Demo

**Frontend:** https://transitops-nine.vercel.app

**Backend API:** https://transitops-1-0wxi.onrender.com/api

---

# ✨ Features

### 🔐 Authentication
- User Registration
- Secure Login
- JWT Authentication
- Role-Based Access Control (RBAC)

### 📊 Dashboard
- Active Vehicles
- Available Vehicles
- Vehicles in Maintenance
- Active Trips
- Pending Trips
- Drivers On Duty
- Fleet Utilization
- Analytics Dashboard

### 🚚 Vehicle Management
- Add/Edit/Delete Vehicles
- Vehicle Status Tracking
- Registration Number Validation
- Vehicle Availability Management

### 👨‍✈️ Driver Management
- Driver Profiles
- License Details
- License Expiry Tracking
- Driver Status Management
- Safety Score

### 🛣️ Trip Management
- Create Trips
- Assign Vehicle
- Assign Driver
- Dispatch Trips
- Complete Trips
- Cancel Trips
- Cargo Validation

### 🔧 Maintenance
- Maintenance Records
- Vehicle Service History
- Automatic Vehicle Status Updates

### ⛽ Fuel & Expense Management
- Fuel Logs
- Expense Tracking
- Maintenance Costs
- Operational Cost Calculation

### 📈 Reports & Analytics
- Fleet Utilization
- Fuel Efficiency
- Operational Cost
- Vehicle ROI
- Charts & Reports

---

# 🛠 Tech Stack

## Frontend
- React.js
- Vite
- React Router
- Axios
- CSS / Tailwind CSS

## Backend
- Node.js
- Express.js
- Sequelize ORM
- JWT Authentication

## Database
- MySQL (Aiven Cloud)

## Deployment
- Frontend → Vercel
- Backend → Render
- Database → Aiven MySQL

---

# 📁 Project Structure

```
TransitOps
│
├── frontend
│   ├── src
│   ├── public
│   ├── components
│   ├── pages
│   ├── services
│   └── package.json
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/transitops.git
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Backend

```bash
cd backend
npm install
npm start
```

---

# 🔑 Environment Variables

Create a `.env` file in the backend.

```env
PORT=5000

DB_HOST=your_host
DB_PORT=27174
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
```

---

# 📡 API Base URL

https://transitops-1-0wxi.onrender.com/api
```


# 📌 Business Rules

- Vehicle registration numbers must be unique.
- Vehicles in maintenance cannot be dispatched.
- Drivers with expired licenses cannot be assigned.
- A driver or vehicle already on a trip cannot be assigned to another trip.
- Cargo weight cannot exceed vehicle capacity.
- Dispatching a trip updates vehicle and driver status to **On Trip**.
- Completing or cancelling a trip restores availability.
- Maintenance automatically updates vehicle status to **In Shop**. :contentReference[oaicite:1]{index=1}

---

# 📊 Modules

- Authentication
- Dashboard
- Vehicles
- Drivers
- Trips
- Maintenance
- Fuel Logs
- Expenses
- Reports & Analytics

---

# 🚀 Future Enhancements

- Email Notifications
- PDF Report Export
- CSV Export
- GPS Tracking
- Vehicle Document Upload
- Dark Mode
- Advanced Analytics
- Search & Filters


LinkedIn: https://linkedin.com/in/your-linkedin

---

# 📄 License

This project is developed for educational and hackathon purposes.
