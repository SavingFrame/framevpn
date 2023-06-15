import typing as t

from pydantic import BaseModel


class UserBaseSchema(BaseModel):
    email: str
    is_active: bool = True
    is_superuser: bool = False
    first_name: str = None
    last_name: str = None


class UserOutSchema(UserBaseSchema):
    pass


class UserCreateSchema(UserBaseSchema):
    password: str

    class Config:
        orm_mode = True


class UserEditSchema(UserBaseSchema):
    password: t.Optional[str] = None

    class Config:
        orm_mode = True


class UserSchema(UserBaseSchema):
    id: int

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str = None
    permissions: str = "user"
