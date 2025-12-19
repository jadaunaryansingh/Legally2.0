
import requests

try:
    response = requests.get("http://localhost:8000/docs")
    print(f"Docs Status Code: {response.status_code}")
except Exception as e:
    print(f"Docs Request failed: {e}")
