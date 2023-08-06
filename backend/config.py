from pathlib import Path, PosixPath
from typing import Dict, Any, Optional

from pydantic import BaseSettings, PostgresDsn, Field
from pydantic.env_settings import DotenvType
from pydantic.typing import StrPath

from network.utils import get_wg_default_endpoint


class Settings(BaseSettings):
    DATABASE_URL: PostgresDsn = Field()
    PROJECT_NAME: str = 'FrameVPN'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    AUTHJWT_SECRET_KEY: str = Field(env='SECRET_KEY')
    WG_MIN_PORT_NUMBER: int = 50000
    WG_MAX_PORT_NUMBER: int = 65535
    WG_BIN: str = Field(env='WG_BIN', default='/usr/bin/wg')
    WG_QUICK_BIN: str = Field(env='WG_QUICK_BIN', default='/usr/bin/wg-quick')
    IPTABLES_BIN: str = Field(env='IPTABLES_BIN', default='/usr/sbin/iptables')
    BASE_DIR: PosixPath = Path(__file__).resolve().parent
    WG_ENDPOINT: str = Field(env='WG_ENDPOINT', default=get_wg_default_endpoint())
    IS_CONFIGURED: bool = Field(env='IS_CONFIGURED', default=False)
    SERVER_NAME: str = Field(env='SERVER_NAME', default='Default')

    class Config:
        env_file = '.env', 'backend/.env'
        env_file_encoding = 'utf-8'

    def reload_settings(self):
        new_settings = Settings()
        for field_name, field_value in new_settings.dict().items():
            setattr(self, field_name, field_value)


settings = Settings()
