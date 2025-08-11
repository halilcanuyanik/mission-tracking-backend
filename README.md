# Mission Tracking System

A full stack web application for managing and tracking missions involving engineers, drivers, and vehicles within an organization.  
This project was developed to simplify coordination, reduce scheduling conflicts, and improve operational efficiency.

---

## 📋 Features

- **Assign Missions** – Select a driver, vehicle, and multiple engineers for each task.
- **Time Management** – Define start and end times for every mission.
- **Availability Checks** – Prevents assigning the same person or vehicle to overlapping missions.
- **Filtering Options** – Search engineers by name or filter by branch.
- **Dynamic Updates** – Mission lists and dropdowns update instantly after changes.
- **User-Friendly Interface** – Clean UI with styled components, gradients, and snackbars for feedback.
- **Mission Overview** – View all current and past assignments in one place.
- **Quick Removal** – Delete missions and instantly free up resources.

---

## 🛠 Tech Stack

### **Frontend**

- React
- Material UI (MUI)
- CSS Modules

### **Backend**

- Node.js
- Express.js
- SQLite

---

## 📂 Project Structure

project-root/
│
├── task_tracker_backend/ # Backend (Node.js + SQLite)
│ ├── routes/ # API routes
│ ├── models/ # Database models
│ ├── server.js # Entry point
│
├── task_tracker_frontend/ # Frontend (React)
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── App.js # Main app
│ │ ├── index.js
│
└── README.md

---

## 🚀 Installation & Setup

### **1. Clone the repository**

### **Frontend**

```bash
git clone https://github.com/halilcanuyanik/mission-tracking-frontend.git
cd mission-tracking-frontend/
```

### **Backend**

```bash
git clone https://github.com/halilcanuyanik/mission-tracking-backend.git
cd mission-tracking-backend/
```

### **2. Install dependencies**

### **Frontend**

```bash
cd mission-tracking-frontend/
npm install
```

### **Backend**

```bash
cd mission-tracking-backend/
npm install
```

### **3. Run the project**

### **Frontend**

```bash
cd mission-tracking-frontend/
npm start
```

### **Backend**

```bash
cd mission-tracking-backend/
node index.js
```

## 📌 Usage

- Open the application in your browser
- Material UI (MUI)
- Create a new mission by selecting driver, vehicle, engineers, and start - end time
- Save the mission to update the mission list. (Filtering is not an obligation)
- Delete a mission to free resources instantly.

## 🎯 Motivation

This project was inspired by the need for a more efficient way to manage personnel and resources in mission-based operations.
Many organizations rely on manual processes or outdated tools that make coordination slow and error-prone.
By developing this application, the goal was to create an intuitive and responsive platform that ensures smooth task assignments and real-time availability updates.

## 📄 License

This project is licensed under the MIT License.
