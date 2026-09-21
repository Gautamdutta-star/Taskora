# 🚀 TASKORA

### AI-Powered Project & Task Management Platform

TASKORA is a full-stack project and task management platform designed to help users organize projects, manage tasks, track progress, and generate actionable tasks using AI.

The platform combines a modern React frontend with a FastAPI backend, PostgreSQL database, JWT-based authentication, and AI-powered task generation.

---

## ✨ Features

### 🔐 Authentication
- User registration
- Secure login
- JWT-based authentication
- Protected routes
- Logout functionality
- Password hashing

### 📊 Dashboard
- Project statistics
- Total task count
- Completed task count
- Overall project progress
- Active project overview
- Quick access to projects and tasks

### 📁 Project Management
- Create projects
- Edit projects
- Delete projects
- View project details
- Project descriptions
- Project-based task organization

### ✅ Task Management
- Create tasks
- Edit tasks
- Delete tasks
- Update task status
- Set task priority
- Set due dates
- Organize tasks by project

### 🔎 Search & Filtering
- Search tasks
- Filter by status
- Filter by priority
- Quickly find relevant tasks

### 🤖 AI Task Generator
TASKORA includes an AI-powered task generation feature.

Users can provide a project goal or requirement, and the AI generates actionable tasks that can be added directly to the project.

Example:

```text
Goal:
Build an e-commerce website

AI Generated Tasks:
1. Design the product listing page
2. Create the product database schema
3. Implement user authentication
4. Develop shopping cart functionality
5. Implement checkout workflow
```

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- Axios
- React Router
- HTML5
- CSS3

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- Password Hashing

### Database

- PostgreSQL

### AI

- Gemini API

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman / Swagger UI

---

## 🏗️ Project Structure

```text
ai-project-task-management-platform/
│
├── backend/
│   ├── auth.py
│   ├── create_tables.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── README.md
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   └── AITaskGenerator.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Projects.jsx
│   │   └── Register.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Gautamdutta-star/ai-project-task-management-platform.git
```

Move into the project directory:

```bash
cd ai-project-task-management-platform
```

---

# 🎨 Frontend Setup

Install frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# 🐍 Backend Setup

Open a new terminal and move into the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

### Windows

```powershell
python -m venv venv
```

Activate it:

```powershell
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

---

# 🗄️ Database Configuration

TASKORA uses PostgreSQL.

Create a PostgreSQL database:

```text
task_manager_db
```

Configure the backend environment variables in:

```text
backend/.env
```

Example:

```env
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager_db

SECRET_KEY=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

> Never commit `.env` files or API keys to GitHub.

---

# ▶️ Run the Backend

From the `backend` directory:

```bash
uvicorn main:app --reload
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

---

# 📚 API Documentation

FastAPI automatically provides interactive API documentation.

After starting the backend, open:

```text
http://127.0.0.1:8000/docs
```

You can use Swagger UI to test the available API endpoints.

---

# 🔑 Authentication Flow

TASKORA uses JWT-based authentication.

The basic authentication flow is:

```text
Register
   ↓
Login
   ↓
JWT Access Token
   ↓
Protected API Requests
   ↓
Dashboard / Projects / Tasks
```

The frontend stores the access token and automatically sends it with protected API requests.

---

# 🤖 AI Task Generation Flow

```text
User enters project goal
          ↓
Frontend sends goal to backend
          ↓
Backend sends request to AI service
          ↓
AI generates actionable tasks
          ↓
Generated tasks displayed to user
          ↓
User can add tasks to project
```

---

# 📈 Dashboard Workflow

```text
Projects
   ↓
Tasks
   ↓
Task Status
   ↓
Progress Calculation
   ↓
Dashboard Statistics
```

Task statuses supported:

```text
todo
in-progress
done
```

Task priorities supported:

```text
low
medium
high
```

---

# 🔒 Security

The project follows basic security practices including:

- JWT authentication
- Password hashing
- Protected API endpoints
- Environment variables for secrets
- `.gitignore` protection for `.env`
- User-specific project access

Sensitive credentials should always remain in environment variables and should never be committed to the repository.

---

# 🧪 Testing

The backend APIs can be tested using:

- Swagger UI
- Postman
- Browser
- Frontend application

Important flows to test:

- User registration
- User login
- Protected routes
- Project creation
- Project editing
- Project deletion
- Task creation
- Task editing
- Task deletion
- Task status updates
- Task priority updates
- Task filtering
- AI task generation
- Logout

---

# 🎯 Internship Task 4

This project was developed as part of the **Innovation Hacks Full Stack Development Internship – Task 4**.

### Task 4 Requirements Covered

- ✅ Registration
- ✅ Login
- ✅ Logout
- ✅ Protected routes
- ✅ Dashboard
- ✅ Project management
- ✅ Task management
- ✅ Task status
- ✅ Task priority
- ✅ Due dates
- ✅ Search
- ✅ Filtering
- ✅ AI-powered feature
- ✅ REST API
- ✅ PostgreSQL database
- ✅ GitHub repository

---

# 🌟 Future Improvements

Possible future enhancements include:

- Real-time notifications
- Team collaboration
- Role-based access control
- Drag-and-drop task boards
- Email reminders
- Calendar integration
- Advanced analytics
- AI project planning
- AI task prioritization
- Cloud deployment
- Docker support

---

# 👨‍💻 Author

**Gautam Dutta**

B.Tech Computer Science & Engineering

---

# 📌 Repository

GitHub:

https://github.com/Gautamdutta-star/ai-project-task-management-platform

---

## ⭐ Project Summary

TASKORA is an AI-powered project and task management workspace that combines project organization, task tracking, progress monitoring, authentication, REST APIs, PostgreSQL, and AI-generated task planning into a single full-stack application.
