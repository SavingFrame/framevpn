from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta

from fastapi_jwt_auth import AuthJWT

from auth.schemas import UserLoginSchema
from config import settings
from database import get_db, SessionLocal
from auth import security
from auth.services import authenticate_user, sign_up_new_user

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


@r.post('/signup')
async def signup(
    db=Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = sign_up_new_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='Account already exists',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    access_token_expires = timedelta(
        minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    if user.is_superuser:
        permissions = 'admin'
    else:
        permissions = 'user'
    access_token = security.create_access_token(
        data={'sub': user.email, 'permissions': permissions},
        expires_delta=access_token_expires,
    )

    return {'access_token': access_token, 'token_type': 'bearer'}
