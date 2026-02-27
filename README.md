<img width="1179" height="2556" alt="screenshots:home" src="https://github.com/user-attachments/assets/b188ab85-8917-4844-bb3f-78976f37ab43" /># Food Delivery App – Full-Stack Mobile MVP

A complete food delivery mobile app built with **React Native (Expo)** for the frontend and **FastAPI + PostgreSQL** for the backend. Includes authentication, real database menu, personalized recommendations, cart, profile, and polished UI.

![Home Screen](screenshots/home.png)  
![Recommended Foods](screenshots/recommended.png)  
![Profile](screenshots/profile.png)  
![Login](screenshots/login.png)
![Search](screenshots/search.png)



## Features Built

- JWT authentication (register/login, auto-login with SecureStore)
- Real PostgreSQL menu (seeded with real food items + images)
- Cosine similarity "Recommended for You" (based on cart contents)
- Cart persistence (add/remove/increase/decrease)
- Profile showing real user data (name, email, phone/address)
- Clean, responsive UI with NativeWind + Tailwind CSS
- Production Android build (AAB/APK) via Expo EAS

## Tech Stack

**Frontend**  
- Expo (SDK 50+)  
- React Native  
- Expo Router (file-based routing)  
- Zustand (state management)  
- Expo SecureStore (token storage)  
- NativeWind + Tailwind CSS  
- React Native Safe Area Context  

**Backend**  
- FastAPI (Python)  
- SQLAlchemy + PostgreSQL  
- PyJWT (authentication)  
- Uvicorn server  

**Tools & Services**  
- Expo EAS (builds & distribution)  

https://github.com/user-attachments/assets/711f98d6-7b15-4c28-aaee-d0a14255a4b6


- GitHub (version control)  
- (Planned: Render for live backend, Cloudinary for images)

## How to Run Locally

### Backend
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload

cd frontend
npm install
npx expo start --clear
# Press i (iOS simulator) or a (Android emulator)
