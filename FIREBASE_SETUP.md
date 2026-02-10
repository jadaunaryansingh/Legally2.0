# Firebase Database Rules Setup

## Issue
You're seeing "Permission denied" errors because Firebase Realtime Database rules are blocking access.

## Quick Fix (For Development/Testing)

### Option 1: Via Firebase Console (Recommended)
1. Go to https://console.firebase.google.com/
2. Select your project: **legally-ee5f9**
3. Click on **Realtime Database** in the left menu
4. Go to the **Rules** tab
5. Replace the existing rules with the content from `database.rules.json` 
6. Click **Publish**

### Option 2: Temporary Open Access (NOT for production)
For quick testing only, you can temporarily set open rules:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **Warning**: This allows anyone to read/write your database. Only use for testing!

## Production Rules (Already in database.rules.json)
The proper rules in `database.rules.json` ensure:
- Users can only read/write their own data
- All operations require authentication
- Data is organized by user ID

## Verifying Rules Are Applied
After updating rules:
1. Refresh your app
2. Sign in with Google
3. Try sending a chat message
4. Check browser console - permission errors should be gone

## Firebase CLI Deployment (Optional)
If you have Firebase CLI installed:
```bash
firebase deploy --only database
```

## Current Firebase Setup
- **Project ID**: legally-ee5f9
- **Database URL**: https://legally-ee5f9-default-rtdb.firebaseio.com
- **Auth Domain**: legally-ee5f9.firebaseapp.com
