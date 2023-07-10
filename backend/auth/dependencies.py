from fastapi import Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from starlette import status

from auth.crud import get_user_by_email
from auth.security import bearer_scheme
from database import get_db
from user.models import User


async def get_current_user(
    db=Depends(get_db),
    _=Depends(bearer_scheme),
    Authorize: AuthJWT = Depends()
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate credentials',
        headers={'WWW-Authenticate': 'Bearer'},
    )
    Authorize.jwt_required()
    token_data = Authorize.get_raw_jwt()
    email: str = token_data.get('sub')
    if email is None:
        raise credentials_exception
    user = get_user_by_email(db, email)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail='Inactive user')
    return current_user


async def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user
