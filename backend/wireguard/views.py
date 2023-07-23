import typing as t

from fastapi import APIRouter, Depends, HTTPException

from auth.dependencies import get_current_active_superuser
from database import SessionLocal, get_db
from network.services.interfaces import NetworkInterfaceService
from wireguard.models import WireguardInterface, WireguardInterfacePeer
from wireguard.schemas import (
    ListWireguardInterfaceSchema, CreateDefaultValuesResponseSchema,
    CreateWireguardInterfaceSchema, DetailWireguardInterfaceSchema, ListInterfacePeersSchema,
)
from wireguard.services.wireguard import WireguardService

wireguard_router = r = APIRouter()


@r.get('/interfaces/create_default_values/')
async def interface_create_default_values(
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> CreateDefaultValuesResponseSchema:
    name = NetworkInterfaceService.generate_name()
    gateway, _ = NetworkInterfaceService.get_default_gateway()
    on_up, on_down = NetworkInterfaceService.generate_iptables_rules(name, gateway)
    return CreateDefaultValuesResponseSchema(
        **{
            'name': name,
            'gateway': gateway,
            'ip_address': NetworkInterfaceService.generate_ipv4_subnet(),
            'on_up': on_up,
            'on_down': on_down,
            'port_number': NetworkInterfaceService.generate_free_port(db)
        }
    )


@r.get('/interfaces/')
async def wireguard_interfaces_list(
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db),
) -> t.List[ListWireguardInterfaceSchema]:
    return db.query(WireguardInterface).all()


@r.get('/interfaces/{interface_uuid}/')
async def wireguard_interface_detail(
    interface_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> DetailWireguardInterfaceSchema:
    wg_interface = db.query(WireguardInterface).filter(WireguardInterface.uuid == interface_uuid).first()
    if not wg_interface:
        raise HTTPException(status_code=404, detail='Wireguard interface not found')
    return wg_interface


@r.delete('/interfaces/{interface_uuid}/', status_code=204)
async def delete_wireguard_interface(
    interface_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
):
    wg_interface = db.query(WireguardInterface).filter(WireguardInterface.uuid == interface_uuid).first()
    if not wg_interface:
        raise HTTPException(status_code=404, detail='Wireguard interface not found')
    WireguardService.delete_wg_interface(wg_interface, db)
    return


@r.post('/interfaces/{interface_uuid}/up/')
async def up_wireguard_interface(
    interface_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> DetailWireguardInterfaceSchema:
    wg_interface = db.query(WireguardInterface).filter(WireguardInterface.uuid == interface_uuid).first()
    if not wg_interface:
        raise HTTPException(status_code=404, detail='Wireguard interface not found')
    WireguardService.up_wg_interface(wg_interface)
    return wg_interface


@r.post('/interfaces/{interface_uuid}/down/')
async def up_wireguard_interface(
    interface_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> ListWireguardInterfaceSchema:
    wg_interface = db.query(WireguardInterface).filter(WireguardInterface.uuid == interface_uuid).first()
    if not wg_interface:
        raise HTTPException(status_code=404, detail='Wireguard interface not found')
    WireguardService.is_wg_iface_down(wg_interface)
    return wg_interface


@r.get('/interfaces/{interface_uuid}/peers/')
async def wireguard_interface_peers_list(
    interface_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> list[ListInterfacePeersSchema]:
    return db.query(WireguardInterfacePeer).filter(WireguardInterfacePeer.interface_id == interface_uuid).all()


@r.get('/interfaces/generate_iptables_rules/')
async def generate_iptables_rules(
    name: str,
    gateway: str,
    current_user=Depends(get_current_active_superuser),
):
    on_up, on_down = NetworkInterfaceService.generate_iptables_rules(name, gateway)
    return on_up, on_down


@r.post('/interfaces/')
async def create_wireguard_interface(
    data: CreateWireguardInterfaceSchema,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> DetailWireguardInterfaceSchema:
    wg_instance = WireguardService.create_wg_interface(data, db)
    return wg_instance
