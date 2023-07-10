from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from auth.security import get_password_hash
from user.models import User
from user.schemas import UserSchema, UserCreateSchema, UserEditSchema


def get_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreateSchema):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User not found')
    db.delete(user)
    db.commit()
    return user


def edit_user(
    db: Session, user_id: int, user: UserEditSchema
) -> UserSchema:
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail='User not found')
    update_data = user.dict(exclude_unset=True)

    if 'password' in update_data:
        update_data['hashed_password'] = get_password_hash(user.password)
        del update_data['password']

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
