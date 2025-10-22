#!/usr/bin/env python3
"""
Simple test script to verify the authentication endpoints are working
Run this after starting the backend server
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_signup():
    """Test user signup"""
    print("Testing signup...")
    try:
        response = requests.post(f"{BASE_URL}/signup", json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword123"
        })
        print(f"Signup Status: {response.status_code}")
        print(f"Signup Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Signup Error: {e}")
        return False

def test_login():
    """Test user login"""
    print("\nTesting login...")
    try:
        response = requests.post(f"{BASE_URL}/login", json={
            "email": "test@example.com",
            "password": "testpassword123"
        })
        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Login Error: {e}")
        return False

def test_health():
    """Test health endpoint"""
    print("\nTesting health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Health Status: {response.status_code}")
        print(f"Health Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Todo App Authentication...")
    print("=" * 40)
    
    health_ok = test_health()
    signup_ok = test_signup()
    login_ok = test_login()
    
    print("\n" + "=" * 40)
    print("Test Results:")
    print(f"Health Check: {'PASS' if health_ok else 'FAIL'}")
    print(f"Signup: {'PASS' if signup_ok else 'FAIL'}")
    print(f"Login: {'PASS' if login_ok else 'FAIL'}")
    
    if all([health_ok, signup_ok, login_ok]):
        print("\nAll tests passed! Authentication is working.")
    else:
        print("\nSome tests failed. Check the backend server and MongoDB connection.")
