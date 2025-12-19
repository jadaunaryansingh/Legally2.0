
import requests
import sys

def test_endpoints():
    print("--- Testing /docs ---")
    try:
        response = requests.get("http://localhost:8000/docs")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("SUCCESS: Docs are accessible.")
        else:
            print("FAILURE: Docs not accessible.")
    except Exception as e:
        print(f"FAILURE: Docs request error: {e}")

    print("\n--- Testing /api/legal-advice ---")
    try:
        payload = {
            "message": "What is the punishment for theft under Indian law?",
            "thread_id": "test_verification_thread"
        }
        response = requests.post(
            "http://localhost:8000/api/legal-advice",
            json=payload
        )
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("Response Content:")
            print(response.json())
            print("SUCCESS: Legal advice endpoint works.")
        else:
            print(f"FAILURE: Status {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"FAILURE: Legal advice request error: {e}")

if __name__ == "__main__":
    test_endpoints()
