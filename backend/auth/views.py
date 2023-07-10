from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_jwt_auth import AuthJWT

from auth.schemas import UserLoginSchema
from auth.services import authenticate_user
from config import settings
from database import get_db, SessionLocal

auth_router = r = APIRouter()


@r.post('/login/')
async def login(
    user_in: UserLoginSchema,
    Authorize: AuthJWT = Depends(),
    db: SessionLocal = Depends(get_db),
):
    user = authenticate_user(db, user_in.email, user_in.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    if user.is_superuser:
        permissions = 'admin'
    else:
        permissions = 'user'
    access_token = Authorize.create_access_token(
        subject=user.email,
        expires_time=access_token_expires,
        user_claims={'permissions': permissions}
    )
    return {'access_token': access_token, 'token_type': 'bearer'}
