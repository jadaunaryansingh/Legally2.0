# Deployment Guide

This guide covers deploying Legally to production using GitHub, Netlify (frontend), and Render (backend).

## Prerequisites

- GitHub account
- Netlify account
- Render account
- Firebase project with service account credentials
- Groq API key (free from https://console.groq.com/keys)

## Step 1: Prepare for Deployment

### 1.1 Update .gitignore

Ensure sensitive files are excluded:
```
.env
firebase-credentials.json
*-firebase-adminsdk-*.json
```

### 1.2 Create Environment Files

**Backend** (`admin-backend/.env`):
```bash
GROQ_API_KEY=your_groq_api_key
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
ADMIN_EMAIL=admin@legally.com
ADMIN_PASSWORD=your_secure_password
CORS_ORIGINS=https://your-app.netlify.app
ENV=production
```

**Frontend** (`.env`):
```bash
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_LEGAL_API_URL=https://your-backend.onrender.com/api/legal-advice
```

## Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial deployment setup"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/legally.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy Backend to Render

### 3.1 Create New Web Service

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: legally-backend
   - **Root Directory**: `admin-backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

### 3.2 Add Environment Variables in Render

Go to "Environment" tab and add:

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
PORT=8000
```

**⚠️ Replace placeholders with your actual keys from local `.env` file**

### 3.3 Add Firebase Credentials as Secret File

1. In Render dashboard, go to "Secret Files"
2. Add file: `firebase-credentials.json`
3. Paste your Firebase service account credentials JSON
4. Save

### 3.4 Update CORS After Deployment

Once your Netlify URL is ready, add it to CORS_ORIGINS:
```
CORS_ORIGINS=https://your-app.netlify.app,https://legally.netlify.app
```

## Step 4: Deploy Frontend to Netlify

### 4.1 Connect Repository

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository

### 4.2 Configure Build Settings

```
Build command: pnpm build
Publish directory: dist
```

### 4.3 Add Environment Variables

Go to "Site settings" → "Environment variables" and add:

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

**⚠️ Replace with your actual Render URL and Firebase config**

### 4.4 Deploy

Click "Deploy site" and wait for build to complete.

## Step 5: Update Backend CORS

After getting your Netlify URL:

1. Go to Render dashboard
2. Update `CORS_ORIGINS` environment variable to include your Netlify URL
3. Click "Manual Deploy" → "Clear build cache & deploy"

## Step 6: Test Production Deployment

1. Visit your Netlify URL
2. Test user signup/login
3. Test chat functionality
4. Login to admin panel: `/login`
   - Email: admin@legally.com
   - Password: Admin@123
5. Verify admin dashboard shows real data

## Troubleshooting

### Backend Issues

**CORS Errors**:
- Ensure Netlify URL is in `CORS_ORIGINS`
- Check Render logs for CORS configuration

**Firebase Errors**:
- Verify `firebase-credentials.json` is uploaded as Secret File
- Check Firebase service account has correct permissions

**API Not Responding**:
- Check Render logs for errors
- Verify all environment variables are set
- Ensure `PORT` variable is set to `$PORT`

### Frontend Issues

**API Connection Failed**:
- Verify `VITE_API_BASE_URL` points to correct Render URL
- Check if backend is running on Render

**Firebase Auth Failed**:
- Verify all Firebase environment variables are correct
- Check Firebase Console for auth configuration

## URLs After Deployment

- **Frontend**: `https://your-app.netlify.app`
- **Backend**: `https://your-backend.onrender.com`
- **Admin Panel**: `https://your-app.netlify.app/login`
- **API Health**: `https://your-backend.onrender.com/api/v1/admin/health`

## Continuous Deployment

Both Netlify and Render will automatically redeploy when you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

## Security Notes

- Never commit `.env` files
- Never commit `firebase-credentials.json`
- Use strong passwords for admin accounts
- Rotate API keys regularly
- Monitor usage on Groq and Firebase consoles
