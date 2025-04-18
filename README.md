
# 🏥 Hospital MLQ Scheduler

This project simulates a Hospital Emergency Room using **Multilevel Queue Scheduling (MLQ)**. It is built with:

- 🔥 React (Frontend)
- 🐍 Flask (Backend)
- ⚙️ Python (Scheduling logic)

## 📌 Features

- Add patients with different conditions: **Coma**, **ICU**, **Accident**, **Normal Injury**
- Each condition is mapped to a specific queue:
  - Critical (FCFS)
  - Serious (Priority)
  - Normal (Round Robin)
- Displays waiting time, turnaround time, and scheduling order

## 💻 Project Structure

```
mlq-hospital-scheduler/
├── backend/         # Flask API
│   └── app.py
└── frontend/        # React App
    └── src/
        └── App.js
```

## 🚀 How to Run

### 1. Start Backend (Flask)

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # On Windows
pip install flask flask-cors
python app.py
```

Runs at: `http://localhost:5000`

### 2. Start Frontend (React)

```bash
cd frontend
npm install
npm start
```

Runs at: `http://localhost:3000`

## 📊 Sample Output

| PID | Queue | Start Time | Completion | Waiting | Turnaround |
|-----|-------|------------|------------|---------|------------|
| P1  | Critical (FCFS) | 0 | 5 | 0 | 5 |
| P2  | Serious (Priority) | 5 | 8 | 3 | 6 |
| P3  | Normal (Round Robin) | 8 | 14 | 6 | 10 |

## 📂 Tech Stack

- React + Tailwind CSS (optional)
- Axios for HTTP calls
- Flask + Python
- Localhost communication via REST API

## 📦 Author

> Developed by [Your Name Here]

---

Feel free to star ⭐ the repo if you like the project!
