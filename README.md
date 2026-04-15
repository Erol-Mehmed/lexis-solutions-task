# CSV Importer

A full-stack CSV import app with asynchronous processing, JWT authentication, and progress tracking.

## Stack

### Backend

- Django
- Django REST Framework
- SimpleJWT
- Celery
- Redis
- SQLite (for this task setup)

### Frontend

- React (Vite)
- TypeScript
- SWR
- Axios
- Zustand
- Bootstrap

---

## Features

### Backend

- User registration and JWT authentication
- Protected endpoints for upload and status
- CSV upload and async processing with Celery
- Job statuses:
    - `pending`
    - `processing`
    - `completed`
    - `failed`
- File extension validation (`.csv`)
- Transaction handling:
    - `transaction.on_commit(...)` for dispatching Celery task
    - atomic status updates in task
- Backend tests for auth and import flow

### Frontend

- Login / register flows
- CSV upload screen with validation
- Polling via SWR for import status
- Progress bar + row counters + final status
- Error messaging for upload/auth failures

---

## Project structure

lexis-solutions-task/  
backend/  
frontend/  
docker-compose.yml  
README.md

---

## Environment variables

### Backend (`backend/.env`)

Required:

Create a `backend/.env` file before running the backend locally or with Docker.

- `SECRET_KEY=...`

Optional:

- `DEBUG=true`
- `ALLOWED_HOSTS=localhost,127.0.0.1`
- `CORS_ALLOWED_ORIGINS=http://localhost:5173`
- `CELERY_BROKER_URL=redis://redis:6379/0`

### Frontend (`frontend/.env`)

Required:

Create a `frontend/.env` file before running the frontend locally or with Docker.

- `VITE_API_BASE_URL=http://localhost:8000`

---

## Run locally (without Docker)

### 1) Backend API

cd backend  
python -m venv .venv  
source .venv/bin/activate  
pip install -r requirements.txt  
python manage.py migrate  
python manage.py runserver

### 2) Redis

redis-server

### 3) Celery worker

cd backend  
source .venv/bin/activate  
celery -A config worker -l info

### 4) Frontend

cd frontend  
npm install  
npm run dev

Frontend: `http://localhost:5173`  
Backend: `http://localhost:8000`

---

## Run with Docker

Make sure `backend/.env` and `frontend/.env` are present before starting the containers.

From project root:

docker-compose up --build

Detached mode:

docker-compose up -d

Stop:

docker-compose down

Run migrations in container:

docker-compose exec backend python manage.py migrate

Run tests in container:

docker-compose exec backend python manage.py test

---

## API endpoints

### Auth

- `POST /api/auth/register/`
- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`
- `POST /api/auth/logout/` (auth required)
- `GET /api/auth/me/` (auth required)

### Imports (auth required)

- `POST /api/imports/upload/`
- `GET /api/imports/<job_id>/`

---

## CSV requirements

- File extension must be `.csv`
- Required headers: `name`, `email`
- Additional columns are allowed

Example:

name,email,age  
John Doe,john@example.com,30  
Jane Doe,jane@example.com,25

---

## Status flow

- `pending`: job created
- `processing`: worker is processing rows
- `completed`: processing finished
- `failed`: job-level error (e.g. empty CSV, invalid structure)

Note: invalid rows increase `failed_rows`, but do not necessarily fail the whole job.

---

## Testing

Run all backend tests:

cd backend  
source .venv/bin/activate  
python manage.py test

The current backend tests cover:

- authentication required for upload/status endpoints
- successful CSV upload flow
- missing file rejection
- non-CSV file rejection
- valid CSV processing
- invalid row handling

Run import tests only:

python manage.py test imports.tests -v 2

---

## Known limitation

For small or very fast files, the progress bar can jump from `0%` to `100%`.  
This is expected with polling + batched progress updates in the backend.

---

## Notes

- SQLite is used for simplicity in this assignment setup.
- The app currently focuses on core import functionality and authentication guard.
- Further hardening (e.g. stricter content validation, per-user job ownership checks) can be added later.

---

## Author

Erol Mehmed
