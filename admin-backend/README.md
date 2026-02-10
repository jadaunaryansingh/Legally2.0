# Admin Backend - FastAPI

A separate Python FastAPI backend for managing the Legal AI assistant admin panel.

## Features

- Admin authentication with Firebase
- Dashboard statistics (user count, query count, active users)
- User management (view users with email/phone only, no personal data)
- Query analytics (view user questions by category)
- Role-based access control (admin-only endpoints)

## Setup Instructions

### Prerequisites

- Python 3.9+
- pip or poetry
- Firebase Admin SDK credentials

### Installation

1. Navigate to the admin-backend folder:
```bash
cd admin-backend
```

2. Create a virtual environment:
```bash
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up Firebase credentials:
   - Download your Firebase service account key from Firebase Console
   - Place it in `admin-backend/firebase-credentials.json`
   - Update the path in `.env` if needed

5. Configure environment variables:
   - Edit `.env` file with your admin credentials
   - Update Firebase database URL
   - Set CORS origins for your frontend URL

### Running the Server

```bash
python main.py
```

The admin API will be available at `http://localhost:8001`

### API Documentation

Once the server is running, view the interactive API docs at:
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

## API Endpoints

### Authentication

- **POST** `/api/v1/admin/login` - Admin login
  - Request: `{ "email": "admin@legally.com", "password": "Admin@123" }`
  - Response: `{ "success": true, "token": "..." }`

### Dashboard

- **GET** `/api/v1/admin/dashboard` - Get dashboard statistics
  - Query params: `token=YOUR_ADMIN_TOKEN`
  - Returns: User count, query count, active users, top categories

### Users Management

- **GET** `/api/v1/admin/users` - List all users (email/phone only)
  - Query params: `limit=50&offset=0&token=YOUR_ADMIN_TOKEN`
  - Returns: User list with pagination

- **POST** `/api/v1/admin/set-admin-role/{user_id}` - Set user as admin
  - Query params: `token=YOUR_ADMIN_TOKEN`
  - Returns: Success status

- **DELETE** `/api/v1/admin/users/{user_id}` - Delete a user
  - Query params: `token=YOUR_ADMIN_TOKEN`
  - Returns: Deletion status

### Queries/Questions

- **GET** `/api/v1/admin/queries` - List all user queries
  - Query params: `limit=50&offset=0&user_id=OPTIONAL&token=YOUR_ADMIN_TOKEN`
  - Returns: Query list with pagination

- **GET** `/api/v1/admin/queries/category/{category}` - Get queries by category
  - Query params: `limit=50&offset=0&token=YOUR_ADMIN_TOKEN`
  - Returns: Filtered query list

### Health

- **GET** `/api/v1/admin/health` - Server health check
  - Returns: Status and timestamp

## Environment Variables

```
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
FIREBASE_DATABASE_URL=https://legally-ee5f9.firebaseio.com
ADMIN_EMAIL=admin@legally.com
ADMIN_PASSWORD=Admin@123
ADMIN_API_PORT=8001
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Security Notes

1. **Admin Credentials**: Change the default admin password in production
2. **Firebase Credentials**: Never commit `firebase-credentials.json` to version control
3. **Token Management**: Implement token expiration and refresh in production
4. **CORS**: Configure CORS origins appropriately for production domains
5. **HTTPS**: Always use HTTPS in production

## Database Integration (Future)

Currently uses in-memory storage for demo. To integrate with a database:

1. Install SQLAlchemy: `pip install sqlalchemy`
2. Create models for users, queries, analytics
3. Replace mock data in endpoints with database queries
4. Update requirements.txt with database driver (postgresql, mysql, etc.)

## Troubleshooting

### Firebase Credentials Error
- Ensure `firebase-credentials.json` is in the correct location
- Check FIREBASE_CREDENTIALS_PATH in `.env`

### CORS Error
- Add your frontend URL to CORS_ORIGINS in `.env`
- Restart the server after changes

### Port Already in Use
- Change ADMIN_API_PORT in `.env` to an available port
- Ensure the frontend is configured to use the new port

## Production Deployment

For production deployment:

1. Install a production ASGI server:
   ```bash
   pip install gunicorn
   ```

2. Run with Gunicorn:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8001
   ```

3. Set environment to production:
   ```
   ENV=production
   ```

4. Use environment variables for all sensitive data
5. Set up proper logging and monitoring
