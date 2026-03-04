from dotenv import load_dotenv
load_dotenv()

import os

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta

from jose import JWTError, jwt
import bcrypt

JWT_SECRET = "iloveyamandeggsaucesomuchthatieatiteveryday"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL env var not set - check Render environment variables!")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class UserModel(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    phone = Column(String)
    address = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class MenuItemModel(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    price = Column(Integer, nullable=False)
    image_url = Column(String)
    calories = Column(Integer)
    protein = Column(Integer)
    category_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="account/session")

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/account")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="User already exists")

    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    new_user = UserModel(
        name=user.name,
        email=user.email,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created", "user": {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    }}

@app.post("/account/session")
def create_session(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user.password_hash.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {"sub": str(db_user.id), "exp": datetime.utcnow() + access_token_expires},
        JWT_SECRET,
        algorithm=ALGORITHM
    )

    return {
        "message": "Session created",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }

@app.get("/me")
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token.strip(), JWT_SECRET.strip(), algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email
    }

@app.post("/seed-menu")
def seed_menu(db: Session = Depends(get_db)):
    db.query(MenuItemModel).delete()
    db.commit()

    menu_items = [
        MenuItemModel(
            name="Classic Burger",
            description="Beef patty, cheese, lettuce, tomato",
            price=2749,
            image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=999&q=80",
            calories=610,
            protein=31,
            category_name="Burgers"
        ),
        MenuItemModel(
            name="Spicy Chicken Pizza",
            description="Spicy chicken, peppers, mozzarella",
            price=3200,
            image_url="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            calories=800,
            protein=35,
            category_name="Pizzas"
        ),
        MenuItemModel(
            name="Beef Burrito",
            description="Beef, rice, beans, salsa",
            price=2200,
            image_url="https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            calories=550,
            protein=28,
            category_name="Burritos"
        ),
        MenuItemModel(
            name="Club Sandwich",
            description="Turkey, bacon, lettuce, tomato",
            price=2749,
            image_url="https://images.unsplash.com/photo-1559054663-e8d23213f55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            calories=610,
            protein=31,
            category_name="Sandwiches"
        ),
        MenuItemModel(
            name="Chicken Shawarma Wrap",
            description="Grilled chicken, garlic sauce, veggies",
            price=1800,
            image_url="https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            calories=480,
            protein=32,
            category_name="Wraps"
        ),
        MenuItemModel(
            name="Veggie Buddha Bowl",
            description="Quinoa, avocado, roasted veggies",
            price=2600,
            image_url="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            calories=450,
            protein=15,
            category_name="Bowls"
        ),
    ]

    db.add_all(menu_items)
    db.commit()

    return {"message": f"{len(menu_items)} menu items seeded successfully"}

@app.get("/menu")
def get_menu(db: Session = Depends(get_db)):
    items = db.query(MenuItemModel).all()
    return [
        {
            "id": i.id,
            "name": i.name,
            "description": i.description,
            "price": i.price / 100.0,
            "image_url": i.image_url,
            "calories": i.calories,
            "protein": i.protein,
            "category_name": i.category_name
        } for i in items
    ]
