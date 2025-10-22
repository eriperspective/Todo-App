#!/usr/bin/env python3
"""
Simple test script to verify the signup route works
"""
import requests
import json

# Test data
test_user = {
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword123"
}

def test_signup():
    try:
        # Make request to signup endpoint
        response = requests.post(
            "http://localhost:8000/signup",
            json=test_user,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print(" Signup successful!")
        else:
            print(" Signup failed!")
            
    except requests.exceptions.ConnectionError:
        print(" Could not connect to server. Make sure the FastAPI server is running on localhost:8000")
    except Exception as e:
        print(f" Error: {e}")

if __name__ == "__main__":
    test_signup()
