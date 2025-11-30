import requests
import sys

BASE_URL = "http://localhost:8000/api/v1"

def register_and_login(email, password):
    # Register
    requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": password,
        "is_superuser": False
    })
    # Login
    resp = requests.post(f"{BASE_URL}/auth/login", data={
        "username": email,
        "password": password
    })
    if resp.status_code == 200:
        return resp.json()["access_token"]
    return None

def test_isolation():
    print("--- Verifying Data Isolation ---")
    
    # 1. Setup Users
    print("\n1. Setting up users...")
    token_a = register_and_login("userA@example.com", "passwordA")
    token_b = register_and_login("userB@example.com", "passwordB")
    
    if not token_a or not token_b:
        print("❌ Failed to create users")
        return

    headers_a = {"Authorization": f"Bearer {token_a}"}
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 2. User A Uploads Document
    print("\n2. User A uploading document...")
    files = {'file': ('test_doc_a.txt', 'This is User A document content.', 'text/plain')}
    resp = requests.post(f"{BASE_URL}/documents/upload", headers=headers_a, files=files)
    
    if resp.status_code != 201:
        print(f"❌ Upload Failed: {resp.status_code} - {resp.text}")
        return
    
    doc_id = resp.json()["id"]
    print(f"✅ Document uploaded by User A (ID: {doc_id})")

    # 3. User B Lists Documents
    print("\n3. User B listing documents...")
    resp = requests.get(f"{BASE_URL}/documents/", headers=headers_b)
    docs_b = resp.json()
    
    if len(docs_b) == 0:
        print("✅ User B sees 0 documents (Correct)")
    else:
        print(f"❌ User B sees {len(docs_b)} documents (Failed)")
        return

    # 4. User B Tries to Access User A's Document
    print("\n4. User B trying to access User A's document...")
    resp = requests.get(f"{BASE_URL}/documents/{doc_id}", headers=headers_b)
    
    if resp.status_code == 404:
        print("✅ User B received 404 Not Found (Correct)")
    else:
        print(f"❌ User B received {resp.status_code} (Failed)")

    # 5. User A Accesses Own Document
    print("\n5. User A accessing own document...")
    resp = requests.get(f"{BASE_URL}/documents/{doc_id}", headers=headers_a)
    
    if resp.status_code == 200:
        print("✅ User A accessed document successfully")
    else:
        print(f"❌ User A failed to access document: {resp.status_code}")

    print("\n--- Isolation Verification Complete ---")

if __name__ == "__main__":
    test_isolation()
