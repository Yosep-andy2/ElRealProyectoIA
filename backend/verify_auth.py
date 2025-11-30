import requests
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_auth():
    print("--- Verifying Auth ---")
    
    # 1. Register
    print("\n1. Registering new user...")
    email = "test@example.com"
    password = "password123"
    
    try:
        # Try to register (might fail if exists, which is fine)
        resp = requests.post(f"{BASE_URL}/auth/register", json={
            "email": email,
            "password": password,
            "is_superuser": False
        })
        if resp.status_code == 200:
            print("✅ Register Success")
        elif resp.status_code == 400 and "exists" in resp.text:
            print("ℹ️ User already exists (OK)")
        else:
            print(f"❌ Register Failed: {resp.status_code} - {resp.text}")
            return
    except Exception as e:
        print(f"❌ Register Error: {e}")
        return

    # 2. Login
    print("\n2. Logging in...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", data={
            "username": email,
            "password": password
        })
        if resp.status_code == 200:
            token = resp.json()["access_token"]
            print(f"✅ Login Success: Token obtained")
        else:
            print(f"❌ Login Failed: {resp.status_code} - {resp.text}")
            return
    except Exception as e:
        print(f"❌ Login Error: {e}")
        return

    # 3. Get Me
    print("\n3. Getting Current User (/me)...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        if resp.status_code == 200:
            user = resp.json()
            print(f"✅ Get Me Success: {user['email']}")
        else:
            print(f"❌ Get Me Failed: {resp.status_code} - {resp.text}")
            return
    except Exception as e:
        print(f"❌ Get Me Error: {e}")
        return

    print("\n--- Auth Verification Complete ---")

if __name__ == "__main__":
    test_auth()
