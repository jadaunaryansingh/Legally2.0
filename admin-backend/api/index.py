"""
Vercel Serverless Handler for FastAPI
"""
from main import app
import os

# Print environment variables for debugging
print("=== Environment Variables ===")
print(f"CORS_ORIGINS: {os.getenv('CORS_ORIGINS', 'NOT SET')}")
print(f"GROQ_API_KEY: {'SET' if os.getenv('GROQ_API_KEY') else 'NOT SET'}")
print(f"FIREBASE_DATABASE_URL: {os.getenv('FIREBASE_DATABASE_URL', 'NOT SET')}")
print("=============================")

# Export the app as 'app' for Vercel
# Vercel will automatically detect this and create a serverless function
