from fastapi import APIRouter, Request, Depends
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select

from auth.crud import (
    get_user,
    create_user,
    delete_user,
    edit_user,
)
from auth.dependencies import get_current_active_user, get_current_active_superuser
from database import get_db
from user.models import User
from user.schemas import UserCreateSchema, UserEditSchema, UserSchema

users_router = r = APIRouter()


@r.get(
    "/users/",
)
async def users_list(
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser),
) -> Page[UserSchema]:
    """
    Get all users
    """
    return paginate(db, select(User))


@r.get("/users/me/", response_model=UserSchema, response_model_exclude_none=True)
async def user_me(current_user=Depends(get_current_active_user)):
    """
    Get own user
    """
    return current_user


@r.get(
    "/users/{user_id}/",
    response_model=UserSchema,
    response_model_exclude_none=True,
)
async def user_details(
    request: Request,
    user_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    """
    Get any user details
    """
    user = get_user(db, user_id)
    return user
    # return encoders.jsonable_encoder(
    #     user, skip_defaults=True, exclude_none=True,
    # )


@r.post("/users/", response_model=UserSchema, response_model_exclude_none=True)
async def user_create(
    request: Request,
    user: UserCreateSchema,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    """
    Create a new user
    """
    return create_user(db, user)


@r.put(
    "/users/{user_id}/", response_model=UserSchema, response_model_exclude_none=True
)
async def user_edit(
    request: Request,
    user_id: int,
    user: UserEditSchema,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    """
    Update existing user
    """
    return edit_user(db, user_id, user)


@r.delete(
    "/users/{user_id}/", response_model=UserSchema, response_model_exclude_none=True
)
async def user_delete(
    request: Request,
    user_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    """
    Delete existing user
    """
    return delete_user(db, user_id)
