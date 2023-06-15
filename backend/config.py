from pydantic import BaseSettings, PostgresDsn, Field


class Settings(BaseSettings):
    DATABASE_URL: PostgresDsn = Field(env='DATABASE_URL')
    PROJECT_NAME: str = 'FrameVPN'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    AUTHJWT_SECRET_KEY: str = Field(env='SECRET_KEY')

    class Config:
        env_file = '.env', 'backend/.env'
        env_file_encoding = 'utf-8'


settings = Settings()
