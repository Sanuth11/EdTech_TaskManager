# 📘 EdTech Task Manager

A MERN-stack task management system designed for schools and educational institutes.  
Teachers can create tasks and track students’ progress, while students can manage the tasks assigned to them.

---

## 🔧 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT Authentication |
| Styling | Custom CSS |

---

## 🚀 Features

### 🧑‍🏫 Teacher Features
- Create, edit, delete tasks  
- View own tasks  
- View student's tasks
- Update progress & dates


### 🧑‍🎓 Student Features
- Create tasks  
- Edit title, description, and  date  
- Update progress  
- Select teacher during signup  
- Can only view and manage their own tasks  

---

## 📂 Project Structure

```
edtech-task-manager/
│
├── client/
├── server/
└── README.md
```

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the repository
```
git clone https://github.com/Sanuth11/EdTech_TaskManager.git
cd edtech-task-manager
```

### 2️⃣ Install dependencies

Backend:
```
cd server
npm install
```

Frontend:
```
cd ../client
npm install
```

### 3️⃣ Create environment file

Create `server/.env`

```
MONGO_URI=mongodb+srv://admin:Admin123@cluster1.doxtz6x.mongodb.net/edtechDB
JWT_SECRET=change_this_to_a_secure_random_string
PORT=5000
```

### 4️⃣ Start backend
```
cd server
npm start
```

### 5️⃣ Start frontend
```
cd ../client
npm run dev
```

---

## 👥 Role Functionality Overview

### 🔵 Teacher Flow
- Login → Dashboard  
- **My Tasks** = tasks created by teacher  
- **Students' Tasks** = tasks created by assigned students  
- Teacher can update progress & due dates  
- Cannot delete students' tasks  

### 🟢 Student Flow
- Select teacher during signup  
- See only their own tasks  
- Can create/edit/delete their tasks  

---

## 🧠 AI Assistance Disclosure
This project received help from AI tools (ChatGPT) for:
- Fixing bugs  
- Improving UI  
- Implementing JWT  
- Backend logic refinement  

All integration and testing done manually.

---

## ⚠️ Known Issues
- No student profile  
- No task filtering by student for teachers  
- No mobile responsive layout  
- UI is basic (no Tailwind)  

---

## 💡 Suggestions for Improvement
- Add analytics dashboard  
- Add Kanban board  
- Add search and filtering  
- Improve UI/UX  
- Add mobile responsiveness  

---

## 🙌 Author
**Sanuth**  
Full Stack MERN Developer  
Open for internships and projects  

---
