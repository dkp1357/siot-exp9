import json
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError

import models
import schemas
import auth
import face_utils
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Facial Biometric Auth API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Auth dependency ────────────────────────────────────────────
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user


# ─── Routes ─────────────────────────────────────────────────────

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user with username and facial biometric."""
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    # Validate face descriptor
    if len(user.face_descriptor) != 128:
        raise HTTPException(status_code=400, detail="Invalid face descriptor (expected 128 values)")

    # Store face encoding as JSON
    encoding_json = json.dumps(user.face_descriptor)

    new_user = models.User(
        username=user.username,
        face_encoding=encoding_json,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    """Authenticate with username and facial biometric."""
    # Find user
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    # Validate face descriptor
    if len(user.face_descriptor) != 128:
        raise HTTPException(status_code=400, detail="Invalid face descriptor")

    # Compare faces
    stored_descriptor = json.loads(db_user.face_encoding)
    is_match = face_utils.compare_faces(stored_descriptor, user.face_descriptor)

    if not is_match:
        distance = face_utils.get_face_distance(stored_descriptor, user.face_descriptor)
        raise HTTPException(
            status_code=401,
            detail=f"Face does not match (similarity: {max(0, (1 - distance)) * 100:.0f}%)"
        )

    # Generate token
    access_token = auth.create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """Get the currently authenticated user's info."""
    return current_user


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
