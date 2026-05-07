# FaceAuth - Biometric Authentication System

A production-style full-stack authentication application using **React (frontend)** and **FastAPI (backend)**. This project implements dual-factor authentication: traditional username/password combined with facial biometric verification.

## Features
- **Facial Biometric Auth**: High-accuracy face matching using `face_recognition`.
- **JWT Security**: Secure session management with JSON Web Tokens.
- **Glassmorphism UI**: Premium, modern interface designed with Vanilla CSS.
- **Webcam Integration**: Real-time camera preview for registration and login.
- **Responsive Design**: Works seamlessly across different screen sizes.
- **Docker Support**: Easy deployment with Docker Compose.

---

## Project Structure
```text
├── backend/
│   ├── main.py           # FastAPI entry point & routes
│   ├── auth.py           # JWT & Password hashing
│   ├── face_utils.py     # Facial embedding & comparison logic
│   ├── models.py         # SQLAlchemy Database models
│   ├── schemas.py        # Pydantic data schemas
│   ├── database.py       # Database configuration
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/        # Login, Register, Dashboard
│   │   ├── components/   # Navbar, etc.
│   │   ├── App.jsx       # Routing & State
│   │   └── index.css     # Premium design system
│   └── package.json      # React dependencies
└── docker-compose.yml    # Orchestration
```

---

## Local Setup

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
   *Note: Installing `face-recognition` requires `cmake` and `dlib`. Ensure you have C++ build tools installed on your system.*
3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## Docker Setup (Recommended)
If you have Docker and Docker Compose installed, you can start the entire system with one command:
```bash
docker-compose up --build
```
The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8000`.

---

## API Documentation
Once the backend is running, visit `http://localhost:8000/docs` to view the interactive Swagger documentation.

### Key Endpoints:
- `POST /register`: Create a new user (Username + Password + Face Image).
- `POST /login`: Authenticate and receive JWT (Requires correct Password + Face Match).
- `GET /users/me`: Retrieve profile of the logged-in user.

---

## Technical Details
- **Face Recognition**: Uses dlib's state-of-the-art face recognition built with deep learning. The model has an accuracy of 99.38% on the Labeled Faces in the Wild benchmark.
- **Storage**: Face encodings are stored as JSON arrays in a SQLite database.
- **Security**: Passwords are hashed using `bcrypt`. JWTs are used for stateless authentication.
