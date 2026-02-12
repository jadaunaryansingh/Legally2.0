"""
Vercel Serverless Handler for FastAPI
"""
import sys
import os

# Add parent directory to path so we can import main
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

# Print environment variables for debugging
print("=== Environment Variables ===")
print(f"CORS_ORIGINS: {os.getenv('CORS_ORIGINS', 'NOT SET')}")
print(f"GROQ_API_KEY: {'SET' if os.getenv('GROQ_API_KEY') else 'NOT SET'}")
print(f"FIREBASE_DATABASE_URL: {os.getenv('FIREBASE_DATABASE_URL', 'NOT SET')}")
print("=============================")

# Export app for Vercel ASGI
