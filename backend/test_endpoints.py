#!/usr/bin/env python3
"""
Simple test script to verify backend endpoints are working
Run this after starting your backend server
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Health check: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_signup():
    """Test user signup"""
    try:
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123"
        }
        response = requests.post(f"{BASE_URL}/signup", json=data)
        print(f"Signup: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Signup failed: {e}")
        return False

def test_login():
    """Test user login"""
    try:
        data = {
            "email": "test@example.com",
            "password": "testpassword123"
        }
        response = requests.post(f"{BASE_URL}/login", json=data)
        print(f"Login: {response.status_code} - {response.json()}")
        if response.status_code == 200:
            return response.json().get("access_token")
        return None
    except Exception as e:
        print(f"Login failed: {e}")
        return None

def test_protected_endpoint(token):
    """Test a protected endpoint"""
    if not token:
        print("No token available for protected endpoint test")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/tasks", headers=headers)
        print(f"Protected endpoint (tasks): {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Protected endpoint test failed: {e}")
        return False

def main():
    print("Testing backend endpoints...")
    print("=" * 50)
    
    # Test health check
    health_ok = test_health_check()
    print()
    
    # Test signup
    signup_ok = test_signup()
    print()
    
    # Test login
    token = test_login()
    print()
    
    # Test protected endpoint
    if token:
        protected_ok = test_protected_endpoint(token)
    else:
        protected_ok = False
    print()
    
    # Summary
    print("=" * 50)
    print("Test Summary:")
    print(f"Health check: {'PASS' if health_ok else 'FAIL'}")
    print(f"Signup: {'PASS' if signup_ok else 'FAIL'}")
    print(f"Login: {'PASS' if token else 'FAIL'}")
    print(f"Protected endpoint: {'PASS' if protected_ok else 'FAIL'}")
    
    if all([health_ok, signup_ok, token, protected_ok]):
        print("\nAll tests passed! Your backend is working correctly.")
    else:
        print("\nSome tests failed. Check the error messages above.")

if __name__ == "__main__":
    main()
