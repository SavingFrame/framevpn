from fastapi.security import HTTPBearer
from passlib.context import CryptContext

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login/")
bearer_scheme = HTTPBearer(auto_error=False)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
