// config.ts — Your future FastAPI connection (fake for now)
export const API_CONFIG = {
    // When backend is ready, change localhost:8000 to your live URL (e.g., https://yourapp.onrender.com)
    BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',

    // For Cloudinary image uploads (we'll set this up later — free & easy)
    CLOUDINARY: {
        CLOUD_NAME: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name_here',
        UPLOAD_PRESET: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_preset_here',
    },

    // Secret for JWT tokens (change this to something random when live)
    JWT_SECRET: 'supersecretkey-change-this-in-production',
};