#!/usr/bin/env python3
"""
Simple test to check if /docs endpoint is accessible
"""

import requests
import time

def test_docs_endpoint():
    """Test if /docs endpoint is accessible"""
    try:
        print("Testing /docs endpoint...")
        start_time = time.time()
        
        response = requests.get("http://localhost:8000/docs", timeout=10)
        end_time = time.time()
        
        response_time = end_time - start_time
        
        if response.status_code == 200:
            print(f"✅ /docs endpoint is accessible! Response time: {response_time:.2f}s")
            return True
        else:
            print(f"❌ /docs endpoint returned status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Is it running on localhost:8000?")
        return False
    except requests.exceptions.Timeout:
        print("❌ Request timed out. Server might be slow or unresponsive.")
        return False
    except Exception as e:
        print(f"❌ Error testing /docs endpoint: {e}")
        return False

def test_health_endpoint():
    """Test health endpoint"""
    try:
        print("Testing health endpoint...")
        response = requests.get("http://localhost:8000/", timeout=5)
        
        if response.status_code == 200:
            print(f"✅ Health endpoint is accessible! Response: {response.json()}")
            return True
        else:
            print(f"❌ Health endpoint returned status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing health endpoint: {e}")
        return False

if __name__ == "__main__":
    print("Backend Accessibility Test")
    print("=" * 40)
    
    health_ok = test_health_endpoint()
    print()
    docs_ok = test_docs_endpoint()
    
    print("\n" + "=" * 40)
    if health_ok and docs_ok:
        print("🎉 All endpoints are accessible!")
    elif health_ok:
        print("⚠️  Health endpoint works but /docs has issues")
    else:
        print("❌ Server is not responding properly")
