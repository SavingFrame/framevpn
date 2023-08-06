from fastapi import APIRouter

from config import settings
from initial_setup import schemas
from initial_setup.utils import save_settings_to_env

initial_setup_router = r = APIRouter()


@r.post('/config/')
async def set_config(
    data: schemas.ConfigSchema,
) -> schemas.ConfigSchema:
    settings_values = data.dict()
    settings_values.update({'IS_CONFIGURED': True})
    save_settings_to_env(settings_values)
    settings.reload_settings()
    return settings


@r.get('/config/')
async def get_config() -> schemas.ConfigSchema:
    return settings
