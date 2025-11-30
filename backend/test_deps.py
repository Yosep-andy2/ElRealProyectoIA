try:
    print("Importing passlib...")
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hash = pwd_context.hash("password")
    print(f"Passlib OK: {hash[:10]}...")
except Exception as e:
    print(f"Passlib Error: {e}")

try:
    print("Importing jose...")
    from jose import jwt
    token = jwt.encode({"sub": "test"}, "secret", algorithm="HS256")
    print(f"Jose OK: {token[:10]}...")
except Exception as e:
    print(f"Jose Error: {e}")

try:
    print("Importing email-validator...")
    from email_validator import validate_email
    v = validate_email("test@example.com")
    print(f"Email Validator OK: {v.email}")
except Exception as e:
    print(f"Email Validator Error: {e}")
