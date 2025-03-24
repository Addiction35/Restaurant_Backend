#!/usr/bin/env python3
"""
Simple script to test the Restaurant POS API endpoints.
"""

import requests
import json
import sys
import os
from datetime import datetime

# Configuration
API_BASE_URL = os.environ.get('API_BASE_URL', 'http://localhost:8000/api')
EMAIL = os.environ.get('API_TEST_EMAIL', 'admin@example.com')
PASSWORD = os.environ.get('API_TEST_PASSWORD', 'admin')

def get_token():
    """Get JWT token for authentication."""
    url = f"{API_BASE_URL}/auth/token/"
    data = {
        "email": EMAIL,
        "password": PASSWORD
    }
    
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        return response.json()['access']
    except requests.exceptions.RequestException as e:
        print(f"Error getting token: {e}")
        sys.exit(1)

def test_endpoints(token):
    """Test various API endpoints."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    endpoints = [
        # Users
        {"url": "/auth/users/", "method": "GET", "name": "List Users"},
        
        # Menu
        {"url": "/menu/categories/", "method": "GET", "name": "List Categories"},
        {"url": "/menu/items/", "method": "GET", "name": "List Menu Items"},
        
        # Tables
        {"url": "/tables/", "method": "GET", "name": "List Tables"},
        {"url": "/tables/sections/", "method": "GET", "name": "List Sections"},
        
        # Orders
        {"url": "/orders/", "method": "GET", "name": "List Orders"},
        
        # Reservations
        {"url": "/reservations/", "method": "GET", "name": "List Reservations"},
        
        # Delivery
        {"url": "/delivery/drivers/", "method": "GET", "name": "List Drivers"},
        
        # Accounting
        {"url": "/accounting/transactions/", "method": "GET", "name": "List Transactions"},
    ]
    
    results = []
    
    for endpoint in endpoints:
        url = f"{API_BASE_URL}{endpoint['url']}"
        method = endpoint['method']
        name = endpoint['name']
        
        try:
            if method == "GET":
                response = requests.get(url, headers=headers)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=endpoint.get('data', {}))
            
            status = response.status_code
            success = 200 <= status < 300
            
            results.append({
                "name": name,
                "url": url,
                "status": status,
                "success": success
            })
            
            if success:
                print(f"✅ {name}: {status}")
            else:
                print(f"❌ {name}: {status}")
                print(f"   Response: {response.text[:100]}...")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ {name}: Error - {e}")
            results.append({
                "name": name,
                "url": url,
                "status": "Error",
                "success": False
            })
    
    # Summary
    success_count = sum(1 for r in results if r['success'])
    total_count = len(results)
    
    print("\n=== Test Summary ===")
    print(f"Total endpoints tested: {total_count}")
    print(f"Successful: {success_count}")
    print(f"Failed: {total_count - success_count}")
    
    if success_count == total_count:
        print("\n🎉 All tests passed! The API is working correctly.")
    else:
        print("\n⚠️ Some tests failed. Please check the API configuration.")

def main():
    print("=== Restaurant POS API Test ===")
    print(f"API Base URL: {API_BASE_URL}")
    print(f"Testing with user: {EMAIL}")
    print("Getting authentication token...")
    
    token = get_token()
    print("Token obtained successfully.")
    
    print("\nTesting API endpoints...")
    test_endpoints(token)

if __name__ == "__main__":
    main()

