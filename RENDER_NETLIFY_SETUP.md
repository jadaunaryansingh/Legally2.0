# Quick Deployment Commands for Render

## Push to GitHub
```bash
git add .
git commit -m "Production deployment setup"
git push origin main
```

## Render Backend Setup

### Build Command:
```bash
pip install -r requirements.txt
```

### Start Command:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Environment Variables:
```
GROQ_API_KEY=your_groq_api_key_here
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
ADMIN_EMAIL=admin@legally.com
ADMIN_PASSWORD=your_secure_password
ENV=production
CORS_ORIGINS=https://your-netlify-app.netlify.app
```

**⚠️ Use your actual keys from your local `.env` file**

### Secret Files:
Create `firebase-credentials.json` with your Firebase service account credentials.

## Netlify Frontend Setup

### Build Settings:
- Build command: `pnpm build`
- Publish directory: `dist`

### Environment Variables:
```
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_LEGAL_API_URL=https://your-backend.onrender.com/api/legal-advice
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

**⚠️ Replace with your actual Firebase config**

## Important Notes

1. **Render Root Directory**: Set to `admin-backend`
2. **Get Your Keys**: Copy actual values from your local `.env` files
5. **Never commit** `.env` or `firebase-credentials.json` filesdate `CORS_ORIGINS` in Render
3. **Test Backend First**: Make sure backend is running before testing frontend
4. **Admin Login**: admin@legally.com / Admin@123
