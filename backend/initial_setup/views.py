from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from initial_setup import schemas
from initial_setup.utils import save_settings_to_env
from wireguard.models import WireguardServer

initial_setup_router = r = APIRouter()


@r.post('/config/')
async def set_config(
    data: schemas.ConfigSchema,
    db: Session = Depends(get_db),
) -> schemas.ConfigSchema:
    settings_values = data.dict()
    settings_values.update({'is_configured': True})
    save_settings_to_env(settings_values)
    settings.reload_settings()
    if not data.external_server:
        wg_server_instance = WireguardServer(endpoint=data.wg_endpoint, name=data.server_name)
        db.add(wg_server_instance)
        db.commit()
    return settings


@r.get('/config/')
async def get_config() -> schemas.ConfigSchema:
    return settings
