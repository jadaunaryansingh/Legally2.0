"""
Test endpoint to verify Vercel is working
"""
from fastapi import FastAPI
from fastapi.responses import JSONResponse

test_app = FastAPI()

@test_app.get("/")
def root():
    return JSONResponse({
        "status": "ok",
        "message": "Vercel Python is working",
        "test": "success"
    })

# Mangum handler for Vercel
from mangum import Mangum
handler = Mangum(test_app, lifespan="off")
