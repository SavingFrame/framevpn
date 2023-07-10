from auth import security
from auth.crud import get_user_by_email, create_user


def authenticate_user(db, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not security.verify_password(password, user.password):
        return False
    return user
