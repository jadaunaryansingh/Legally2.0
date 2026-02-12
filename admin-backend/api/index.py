"""
Vercel Serverless Handler for FastAPI
"""
import sys
import os

# Simple test handler first
def handler(event, context):
    """Simple test to see if deployment works"""
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": '{"status": "Backend is working!", "message": "FastAPI not loaded yet - testing basic deployment"}'
    }
