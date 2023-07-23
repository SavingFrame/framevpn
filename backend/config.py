from pathlib import Path, PosixPath

from pydantic import BaseSettings, PostgresDsn, Field


class Settings(BaseSettings):
    DATABASE_URL: PostgresDsn = Field(env='DATABASE_URL')
    PROJECT_NAME: str = 'FrameVPN'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    AUTHJWT_SECRET_KEY: str = Field(env='SECRET_KEY')
    WG_MIN_PORT_NUMBER: int = 50000
    WG_MAX_PORT_NUMBER: int = 65535
    WG_BIN: str = Field(env='WG_BIN', default='/usr/bin/wg')
    WG_QUICK_BIN: str = Field(env='WG_QUICK_BIN', default='/usr/bin/wg-quick')
    IPTABLES_BIN: str = Field(env='IPTABLES_BIN', default='/usr/sbin/iptables')
    BASE_DIR: PosixPath = Path(__file__).resolve().parent

    class Config:
        env_file = '.env', 'backend/.env'
        env_file_encoding = 'utf-8'


settings = Settings()
