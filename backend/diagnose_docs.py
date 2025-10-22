#!/usr/bin/env python3
"""
Diagnostic script to check if /docs endpoint is working
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("=" * 60)
print("DIAGNOSING /docs ENDPOINT ISSUE")
print("=" * 60)

# Test 1: Import the app
print("\n1. Testing app import...")
try:
    from app.main import app
    print("   PASS App imported successfully")
except Exception as e:
    print(f"   FAIL Failed to import app: {e}")
    sys.exit(1)

# Test 2: Check if docs_url is set
print("\n2. Checking FastAPI configuration...")
print(f"   - docs_url: {app.docs_url}")
print(f"   - redoc_url: {app.redoc_url}")
print(f"   - openapi_url: {app.openapi_url}")

# Test 3: List all routes
print("\n3. Listing all available routes...")
for route in app.routes:
    print(f"   - {route.path} ({route.methods if hasattr(route, 'methods') else 'N/A'})")

# Test 4: Check OpenAPI schema generation
print("\n4. Testing OpenAPI schema generation...")
try:
    openapi_schema = app.openapi()
    if openapi_schema:
        print(f"   PASS OpenAPI schema generated ({len(str(openapi_schema))} bytes)")
        print(f"   - Title: {openapi_schema.get('info', {}).get('title')}")
        print(f"   - Version: {openapi_schema.get('info', {}).get('version')}")
        print(f"   - Paths: {len(openapi_schema.get('paths', {}))}")
    else:
        print("   FAIL OpenAPI schema is empty")
except Exception as e:
    print(f"   FAIL Failed to generate OpenAPI schema: {e}")
    import traceback
    traceback.print_exc()

# Test 5: Check middleware
print("\n5. Checking middleware...")
print(f"   - Number of middleware: {len(app.user_middleware)}")
for middleware in app.user_middleware:
    print(f"   - {middleware}")

# Test 6: Test the health endpoint
print("\n6. Testing health endpoint simulation...")
try:
    from fastapi.testclient import TestClient
    client = TestClient(app)
    response = client.get("/")
    print(f"   PASS Health endpoint: {response.status_code} - {response.json()}")
except Exception as e:
    print(f"   FAIL Failed to test health endpoint: {e}")

# Test 7: Test the docs endpoint
print("\n7. Testing /docs endpoint simulation...")
try:
    from fastapi.testclient import TestClient
    client = TestClient(app)
    response = client.get("/docs")
    if response.status_code == 200:
        print(f"   PASS /docs endpoint accessible: {response.status_code}")
        print(f"   - Content length: {len(response.content)}")
    else:
        print(f"   FAIL /docs endpoint returned: {response.status_code}")
        print(f"   - Response: {response.text[:200]}")
except Exception as e:
    print(f"   FAIL Failed to test /docs endpoint: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("DIAGNOSIS COMPLETE")
print("=" * 60)
