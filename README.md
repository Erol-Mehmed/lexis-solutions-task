# 📦 CSV Importer (Django + React)

## 📖 Overview

This project is a full-stack application that allows users to upload CSV files and process them asynchronously using a backend worker. It demonstrates file upload handling, background processing, progress tracking, and frontend polling.

The system consists of:

- **Backend:** Django + Django REST Framework + Celery + Redis  
- **Frontend:** React (Vite) + TypeScript  
- **Database:** PostgreSQL (or SQLite for local development)  
- **Task Queue:** Celery with Redis as broker  

---

## 🚀 Features

### Backend
- Upload CSV files via REST API  
- Asynchronous processing using Celery  
- Progress tracking (processed rows vs total rows)  
- Job status tracking:
  - pending
  - processing
  - completed
  - failed  
- Basic CSV validation  
- Automated backend tests  

### Frontend
- File upload interface  
- Upload progress tracking UI  
- Polling backend for job status (SWR)  
- Dynamic progress bar updates  
- Displays:
  - Total rows  
  - Processed rows  
  - Success / failed counts  
  - Job status  

---

## 📂 CSV Format

The uploaded CSV file must include at least:

name,email

Additional columns are allowed and will be ignored or processed depending on implementation.

### Example:

name,email,age
John Doe,john@example.com,30
Jane Doe,jane@example.com,25

---

## ⚙️ Backend Setup

### 1. Clone repository

git clone <repo-url>
cd backend

### 2. Create virtual environment

python -m venv .venv
source .venv/bin/activate

### 3. Install dependencies

pip install -r requirements.txt

### 4. Run migrations

python manage.py migrate

### 5. Create superuser

python manage.py createsuperuser

### 6. Run server

python manage.py runserver

---

## ⚡ Celery + Redis Setup

Start Redis:

redis-server

Start Celery worker:

celery -A config worker -l info

---

## 🧪 Running Tests

python manage.py test

Tests cover:

- Import job creation  
- Valid CSV processing  
- Invalid CSV handling  
- Upload endpoint behavior  

---

## 🎨 Frontend Setup

### 1. Navigate to frontend

cd frontend

### 2. Install dependencies

npm install

### 3. Run development server

npm run dev

Frontend runs at:

http://localhost:5173  

Backend runs at:

http://localhost:8000  

---

## 🔁 How It Works

1. User selects a CSV file in the frontend  
2. File is uploaded to the backend via API  
3. Backend creates an ImportJob  
4. Celery processes the file asynchronously  
5. Backend updates progress (processed rows)  
6. Frontend polls job status via SWR  
7. UI updates progress bar and results in real-time  

---

## 🧱 API Endpoints

### Upload CSV

POST /api/imports/upload/

Response:

{
  "id": 1
}

---

### Get Import Status

GET /api/imports/<job_id>/

Response:

{
  "id": 1,
  "status": "processing",
  "processed_rows": 5,
  "total_rows": 10,
  "success_rows": 5,
  "failed_rows": 0
}

---

## 🧾 Status Flow

- pending → Job created  
- processing → Celery is working  
- completed → Finished successfully  
- failed → Error occurred  

---

## 🧪 Notes & Design Decisions

- Progress updates are saved periodically (e.g. every N rows) to avoid excessive DB writes  
- Frontend uses polling (SWR) instead of WebSockets for simplicity  
- Authentication is not implemented (out of scope for this project)  
- Focus was on demonstrating:
  - Async processing  
  - API design  
  - Frontend-backend integration  
  - State tracking and UI feedback  

---

## 📌 Future Improvements

- Authentication (token-based)  
- Role-based access control  
- WebSocket-based live updates  
- Better CSV validation and error reporting  
- File storage optimization (e.g., S3)  
- Pagination for large datasets  

---

## 👤 Author

Your Name  Erol Mehmed
