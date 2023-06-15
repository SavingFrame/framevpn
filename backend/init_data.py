from auth.crud import create_user
from user.schemas import UserCreateSchema
from database import SessionLocal


def init() -> None:
    db = SessionLocal()

    create_user(
        db,
        UserCreateSchema(
            email='admin@example.com',
            password='password',
            is_active=True,
            is_superuser=True,
        ),
    )


if __name__ == '__main__':
    print('Creating superuser admin@framevpn.com')
    init()
    print('Superuser created')
