from fastapi import Depends, APIRouter
from fastapi_pagination import Page
from sqlalchemy import select
from starlette.responses import PlainTextResponse

from auth.dependencies import get_current_active_superuser
from database import SessionLocal, get_db
from wireguard.api.v1.schemas import clients as schemas
from wireguard.models import WireguardInterfacePeer, WireguardClient, WireguardInterface
from fastapi_pagination.ext.sqlalchemy import paginate

from wireguard.services.client import WireguardClientService

client_router = r = APIRouter()


@r.get('/clients/')
async def clients_list(
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> Page[schemas.ListClientSchema]:
    return paginate(db, select(WireguardClient))


@r.post('/clients/')
async def client_create(
    data: schemas.CreateClientSchema,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> schemas.DetailClientSchema:
    return WireguardClientService.create(data, db)


@r.get('/clients/{client_uuid}/')
async def client_details(
    client_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> schemas.DetailClientSchema:
    return db.query(WireguardClient).filter(WireguardClient.uuid == client_uuid).first()


@r.delete('/clients/{client_uuid}/')
async def client_delete(
    client_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
):
    WireguardClientService.delete(client_uuid, db)


@r.get('/interfaces/{interface_uuid}/peers/')
async def interface_peers_list(
    interface_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> list[schemas.ListInterfacePeersSchema]:
    return db.query(WireguardInterfacePeer).filter(WireguardInterfacePeer.interface_id == interface_uuid).all()


@r.get('/clients/{client_uuid}/download_config/', response_class=PlainTextResponse)
async def client_download_config(
    client_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> str:
    client = db.query(WireguardClient).filter(
        WireguardClient.uuid == client_uuid,
    ).first()
    return WireguardClientService.generate_wg_config(client)


@r.get('/clients/{client_uuid}/peers/')
async def client_interfaces_list(
    client_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> list[schemas.ListClientPeerSchema]:
    return db.query(WireguardInterfacePeer).filter(WireguardInterfacePeer.client_id == client_uuid).all()


@r.post('/clients/{client_uuid}/peers/')
async def client_peer_create(
    data: schemas.CreateClientPeerSchema,
    client_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> schemas.ListClientPeerSchema:
    return WireguardClientService.create_peer(data, client_uuid, db)


@r.delete('/clients/{client_uuid}/peers/{interface_uuid}/', status_code=204)
async def client_peer_delete(
    interface_uuid: str,
    client_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
):
    WireguardClientService.delete_peer(
        interface_id=interface_uuid,
        client_id=client_uuid,
        db=db
    )
    return
