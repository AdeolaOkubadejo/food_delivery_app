<img width="117" height="255" alt="screenshots:home" src="https://github.com/user-attachments/assets/b188ab85-8917-4844-bb3f-78976f37ab43" />
<img width="117" height="255" alt="screenshots:recommended" src="https://github.com/user-attachments/assets/1bfa4145-30e0-4212-b366-5417a28a54c8" />
<img width="117" height="255" alt="screenshots:search" src="https://github.com/user-attachments/assets/7d14b1c6-18c0-4053-b776-333494c1ea82" />
<img width="117" height="255" alt="screenshots:profile" src="https://github.com/user-attachments/assets/7ffb450e-312d-41d3-9e0d-640bab92f51b" />
<img width="117" height="255" alt="screenshots:login" src="https://github.com/user-attachments/assets/606e85af-d4f8-4ef8-b6f8-5c15e5e4e3d0" />
<img width="117" height="255" alt="signupscreenshot" src="https://github.com/user-attachments/assets/5655940c-778b-4dcd-aec6-9b8b63769920" />

https://github.com/user-attachments/assets/711f98d6-7b15-4c28-aaee-d0a14255a4b6


# Food Delivery App – Full-Stack Mobile MVP

A complete food delivery mobile app built with **React Native (Expo)** for the frontend and **FastAPI + PostgreSQL** for the backend. Includes authentication, real database menu, personalized recommendations, cart, profile, and polished UI.


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
