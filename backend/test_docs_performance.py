#!/usr/bin/env python3
"""
Performance test script for the /docs endpoint
"""

import requests
import time
import statistics

BASE_URL = "http://localhost:8000"

def test_docs_performance(num_requests=5):
    """Test the performance of the /docs endpoint"""
    print(f"Testing /docs endpoint performance with {num_requests} requests...")
    
    response_times = []
    
    for i in range(num_requests):
        start_time = time.time()
        try:
            response = requests.get(f"{BASE_URL}/docs")
            end_time = time.time()
            response_time = end_time - start_time
            response_times.append(response_time)
            
            status = "PASS" if response.status_code == 200 else "FAIL"
            print(f"Request {i+1}: {status} {response_time:.3f}s (Status: {response.status_code})")
            
        except Exception as e:
            print(f"Request {i+1}: FAIL Failed - {e}")
    
    if response_times:
        avg_time = statistics.mean(response_times)
        min_time = min(response_times)
        max_time = max(response_times)
        
        print(f"\nPerformance Summary:")
        print(f"Average response time: {avg_time:.3f}s")
        print(f"Min response time: {min_time:.3f}s")
        print(f"Max response time: {max_time:.3f}s")
        
        if avg_time < 1.0:
            print("/docs endpoint is performing well!")
        elif avg_time < 3.0:
            print("/docs endpoint is acceptable but could be faster")
        else:
            print("/docs endpoint is too slow")
    else:
        print("No successful requests to analyze")

def test_health_endpoint():
    """Test the health endpoint for comparison"""
    print("\nTesting health endpoint for comparison...")
    
    start_time = time.time()
    try:
        response = requests.get(f"{BASE_URL}/")
        end_time = time.time()
        response_time = end_time - start_time
        
        status = "PASS" if response.status_code == 200 else "FAIL"
        print(f"Health endpoint: {status} {response_time:.3f}s (Status: {response.status_code})")
        return response_time
    except Exception as e:
        print(f"Health endpoint: FAIL Failed - {e}")
        return None

if __name__ == "__main__":
    print("Backend Performance Test")
    print("=" * 50)
    
    # Test health endpoint first
    health_time = test_health_endpoint()
    
    # Test docs endpoint
    test_docs_performance()
    
    print("\n" + "=" * 50)
    print("Note: If /docs is still slow, check:")
    print("1. MongoDB connection status")
    print("2. Network connectivity")
    print("3. Server resources")
    print("4. Check server logs for errors")
