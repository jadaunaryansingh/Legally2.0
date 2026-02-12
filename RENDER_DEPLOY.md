# Deploy Backend to Render + Frontend to Netlify

## Step 1: Deploy Backend to Render

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. **Connect GitHub**: Select `jadaunaryansingh/Legally2.0`
4. **Configure:**
   - **Name**: `legally-backend`
   - **Root Directory**: `admin-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`

5. **Add Environment Variables** (copy from admin-backend/.env):
   ```
   GROQ_API_KEY=your_groq_key_from_env_file
   FIREBASE_DATABASE_URL=your_firebase_database_url
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   ADMIN_EMAIL=admin@legally.com
   ADMIN_PASSWORD=Admin@123
   ENV=production
   CORS_ORIGINS=https://legally2026.netlify.app,http://localhost:5173
   ```

   **📋 Copy actual values from your `admin-backend/.env` file!**

6. **Add Secret File** `firebase-credentials.json`:
   - Click "Secret Files" → "Add Secret File"
   - Filename: `firebase-credentials.json`
   - Copy content from your local `admin-backend/firebase-credentials.json`

7. Click **"Create Web Service"**

8. **Wait 3-5 minutes** - Your backend will be live at: `https://legally-backend.onrender.com`

## Step 2: Update Frontend Environment

After Render deployment completes, note your backend URL.

**Option A: Set env var in Netlify Dashboard:**
1. Netlify Dashboard → legally2026 → Site Settings → Environment Variables
2. Add: `VITE_API_BASE_URL` = `https://legally-backend.onrender.com`

**Option B: Or create .env for local dev:**
```bash
VITE_API_BASE_URL=https://legally-backend.onrender.com
```

## Step 3: Deploy Frontend to Netlify

Frontend already deployed at: https://legally2026.netlify.app

Just push changes:
```bash
git add .
git commit -m "Switch backend to Render"
git push
```

Netlify auto-deploys in 2 minutes.

## Step 4: Test

1. **Backend Health**: https://legally-backend.onrender.com/api/v1/admin/health
2. **Frontend**: https://legally2026.netlify.app/
3. **Admin Login**: https://legally2026.netlify.app/login
   - Email: admin@legally.com
   - Password: Admin@123

## Done! ✅

- Backend: Render (Python/FastAPI)
- Frontend: Netlify (React/Vite)
- No more Vercel issues!
