# API Setup & Configuration Guide

## Overview

This document outlines the API configuration and integration setup for the Legally application.

## Environment Variables (.env.local)

All API endpoints and configurations are stored in `.env.local`. The file is organized into the following sections:

### Firebase Configuration
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```

### FastAPI Backend
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_PREFIX=/api/v1
```

### API Endpoints Categories

#### 1. Authentication Endpoints
- **Login**: `POST /api/v1/auth/login`
- **Signup**: `POST /api/v1/auth/signup`
- **Logout**: `POST /api/v1/auth/logout`
- **Refresh Token**: `POST /api/v1/auth/refresh`
- **Verify Token**: `GET /api/v1/auth/verify`

#### 2. Chat/AI Legal Assistant
- **Send Message**: `POST /api/v1/chat/message`
- **Get History**: `GET /api/v1/chat/history`
- **Clear History**: `POST /api/v1/chat/clear`
- **Search**: `POST /api/v1/chat/search`

#### 3. Legal Information
- **Search Laws**: `POST /api/v1/laws/search`
- **Get Law Details**: `GET /api/v1/laws/get`
- **Explain Law**: `POST /api/v1/laws/explain`
- **Get Sections**: `GET /api/v1/laws/sections`
- **Crime Analysis**: `POST /api/v1/laws/crime-analysis`
- **IPC List**: `GET /api/v1/laws/ipc/list`
- **CRPC List**: `GET /api/v1/laws/crpc/list`

#### 4. User Profile
- **Get Profile**: `GET /api/v1/user/profile`
- **Update Profile**: `PUT /api/v1/user/update`
- **Get Settings**: `GET /api/v1/user/settings`
- **Update Settings**: `PUT /api/v1/user/settings`
- **Delete Account**: `DELETE /api/v1/user/delete`

#### 5. Browse & Search
- **Browse Laws**: `GET /api/v1/browse/laws`
- **Browse Acts**: `GET /api/v1/browse/acts`
- **Browse Cases**: `GET /api/v1/browse/cases`
- **Browse Sections**: `GET /api/v1/browse/sections`

#### 6. Analytics & Logging
- **Track Event**: `POST /api/v1/analytics/track`
- **Log Error**: `POST /api/v1/logs/error`

## Using the API Service

The `client/services/api.ts` file provides a centralized API service with pre-configured endpoints.

### Example: Sending a Chat Message

```typescript
import { chatAPI } from '@/services/api';

const response = await chatAPI.sendMessage("What is Section 420 of IPC?");
if (response.success) {
  console.log(response.data);
} else {
  console.error(response.error);
}
```

### Example: Searching Laws

```typescript
import { lawsAPI } from '@/services/api';

const response = await lawsAPI.search("theft", { 
  filters: { act: "IPC" } 
});
```

### Example: Crime Analysis

```typescript
import { lawsAPI } from '@/services/api';

const response = await lawsAPI.crimeAnalysis(
  "I found stolen goods in someone's house"
);
```

### Example: User Profile

```typescript
import { userAPI } from '@/services/api';

// Get profile
const profile = await userAPI.getProfile();

// Update profile
const updated = await userAPI.updateProfile({
  name: "John Doe",
  phone: "+91-1234567890"
});
```

### Example: Analytics

```typescript
import { analyticsAPI } from '@/services/api';

// Track user event
await analyticsAPI.track('law_viewed', { 
  lawId: '420ipc',
  duration: 45 
});

// Log errors
await analyticsAPI.logError('Network error', { 
  endpoint: '/chat/message',
  statusCode: 500 
});
```

## OAuth Setup (Google & GitHub)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new OAuth 2.0 credential for Web Application
3. Get your **Client ID**
4. In Firebase Console:
   - Go to Authentication > Sign-in method
   - Enable Google
   - Add your OAuth Client ID

**Note**: The Google Sign-in button on the login page now has a click handler that will trigger `signInWithGoogle()` from Firebase.

### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Get your **Client ID** and **Client Secret**
4. In Firebase Console:
   - Go to Authentication > Sign-in method
   - Enable GitHub
   - Add your Client ID and Secret

**Note**: The GitHub Sign-in button on the login page now has a click handler that will trigger `signInWithGithub()` from Firebase.

## Authentication Flow

### Email/Password Authentication
1. User enters email and password
2. Firebase authenticates via `signInWithEmailAndPassword()`
3. User credentials stored in localStorage
4. User redirected to dashboard

### OAuth Authentication (Google/GitHub)
1. User clicks "Continue with Google" or "Continue with GitHub"
2. Firebase popup opens for OAuth consent
3. User approves permissions
4. Firebase returns user data
5. User credentials stored in localStorage
6. User redirected to dashboard

## Token Management

After OAuth or email/password authentication:

```typescript
// Get auth token
const token = localStorage.getItem("authToken");

// Set auth token (if your backend returns it)
import { setAuthToken } from '@/services/api';
setAuthToken(token);

// Clear token on logout
import { clearAuthToken } from '@/services/api';
clearAuthToken();
```

## FastAPI Backend Requirements

Your FastAPI backend should implement the following endpoints:

### Authentication

```python
@app.post("/api/v1/auth/login")
async def login(email: str, password: str):
    # Authenticate user
    return {"token": "...", "user": {...}}

@app.post("/api/v1/auth/signup")
async def signup(email: str, password: str, name: str = None):
    # Create new user
    return {"token": "...", "user": {...}}

@app.post("/api/v1/auth/logout")
async def logout(Authorization: str = Header()):
    # Logout user
    return {"message": "Logged out successfully"}
```

### Chat

```python
@app.post("/api/v1/chat/message")
async def send_message(message: str, conversationId: str = None):
    # Process message with AI
    return {"response": "...", "conversationId": "..."}

@app.get("/api/v1/chat/history")
async def get_history(id: str = None):
    # Get chat history
    return {"messages": [...]}
```

### Laws

```python
@app.post("/api/v1/laws/search")
async def search_laws(query: str, filters: dict = None):
    # Search legal database
    return {"results": [...]}

@app.post("/api/v1/laws/crime-analysis")
async def crime_analysis(scenario: str):
    # Analyze crime scenario using AI
    return {"analysis": "...", "applicableSections": [...]}
```

## Error Handling

All API calls return a standardized response:

```typescript
{
  success: boolean,
  data?: any,      // Only if success is true
  error?: string   // Only if success is false
}
```

## CORS Configuration

Make sure your FastAPI backend has CORS enabled for your frontend URL:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Rate Limiting & Security

- All API calls include Authorization header with Bearer token (if available)
- Consider implementing rate limiting on your FastAPI backend
- Use HTTPS in production
- Implement CSRF protection

## Troubleshooting

### OAuth Buttons Not Working
- Check that Google/GitHub OAuth is enabled in Firebase Console
- Ensure your application domain is added to authorized domains
- Check browser console for popup blocking messages
- Allow popups for your domain

### API Calls Failing
- Check that FastAPI backend is running on the correct port
- Verify `VITE_API_BASE_URL` matches your backend URL
- Check CORS configuration on backend
- Verify authentication token is valid

### Environment Variables Not Loading
- Ensure `.env.local` file exists in the project root
- Restart dev server after modifying `.env.local`
- Variables must be prefixed with `VITE_` to be accessible in Vite

## Production Deployment

Before deploying to production:

1. Update `VITE_API_BASE_URL` to your production API URL
2. Configure OAuth credentials for your production domain
3. Ensure HTTPS is enabled
4. Set appropriate CORS origins
5. Configure environment variables in your deployment platform
6. Test all OAuth flows in production environment
