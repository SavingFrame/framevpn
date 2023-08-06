import typing as t

from fastapi import Depends, HTTPException, APIRouter

from auth.dependencies import get_current_active_superuser
from database import SessionLocal, get_db
from network.services.interfaces import NetworkInterfaceService
from wireguard.api.v1.schemas import wireguard as schemas
from wireguard.models import WireguardInterface
from wireguard.services.server import WireguardServerService

wireguard_router = r = APIRouter()


@r.get('/interfaces/')
async def wireguard_interfaces_list(
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db),
) -> t.List[schemas.ListWireguardInterfaceSchema]:
    return db.query(WireguardInterface).all()


@r.post('/interfaces/')
async def create_wireguard_interface(
    data: schemas.CreateWireguardInterfaceSchema,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> schemas.DetailWireguardInterfaceSchema:
    wg_instance = WireguardServerService.create_wg_interface(data, db)
    return wg_instance


@r.get('/interfaces/generate_iptable_rules/')
async def generate_iptable_rules(
    name: str,
    gateway_interface: str,
    current_user=Depends(get_current_active_superuser),
) -> schemas.IptablesRulesSchema:
    on_up, on_down = NetworkInterfaceService.generate_iptables_rules(name, gateway_interface)
    return schemas.IptablesRulesSchema(**{'on_up': on_up, 'on_down': on_down})


@r.get('/interfaces/create_default_values/')
async def interface_create_default_values(
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> schemas.CreateDefaultValuesResponseSchema:
    name = NetworkInterfaceService.generate_name()
    gateway, _ = NetworkInterfaceService.get_default_gateway()
    on_up, on_down = NetworkInterfaceService.generate_iptables_rules(name, gateway)
    return schemas.CreateDefaultValuesResponseSchema(
        **{
            'name': name,
            'gateway': gateway,
            'ip_address': NetworkInterfaceService.generate_ipv4_subnet(),
            'on_up': on_up,
            'on_down': on_down,
            'port_number': NetworkInterfaceService.generate_free_port(db)
        }
    )


@r.get('/interfaces/{interface_uuid}/')
async def wireguard_interface_detail(
    interface_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> schemas.DetailWireguardInterfaceSchema:
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
    WireguardServerService.delete_wg_interface(wg_interface, db)
    return


@r.post('/interfaces/{interface_uuid}/up/')
async def up_wireguard_interface(
    interface_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> schemas.DetailWireguardInterfaceSchema:
    wg_interface = db.query(WireguardInterface).filter(WireguardInterface.uuid == interface_uuid).first()
    if not wg_interface:
        raise HTTPException(status_code=404, detail='Wireguard interface not found')
    WireguardServerService.up_wg_interface(wg_interface)
    return wg_interface


@r.post('/interfaces/{interface_uuid}/down/')
async def down_wireguard_interface(
    interface_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> schemas.ListWireguardInterfaceSchema:
    wg_interface = db.query(WireguardInterface).filter(WireguardInterface.uuid == interface_uuid).first()
    if not wg_interface:
        raise HTTPException(status_code=404, detail='Wireguard interface not found')
    WireguardServerService.down_wg_interface(wg_interface)
    return wg_interface


@r.post('/interfaces/{interface_uuid}/restart/')
async def restart_wireguard_interface(
    interface_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> schemas.DetailWireguardInterfaceSchema:
    wg_interface = db.query(WireguardInterface).filter(WireguardInterface.uuid == interface_uuid).first()
    if not wg_interface:
        raise HTTPException(status_code=404, detail='Wireguard interface not found')
    WireguardServerService.restart_wg_interface(wg_interface)
    return wg_interface


@r.get('/interfaces/{interface_uuid}/get_free_ip_address/')
async def get_free_ip_address(
    interface_uuid: str,
    current_user=Depends(get_current_active_superuser),
    db: SessionLocal = Depends(get_db)
) -> schemas.FreeIpAddressSchema:
    wg_interface = db.query(WireguardInterface).filter(WireguardInterface.uuid == interface_uuid).first()
    if not wg_interface:
        raise HTTPException(status_code=404, detail='Wireguard interface not found')
    ip_address = NetworkInterfaceService.get_free_ip_address(wg_interface)
    return schemas.FreeIpAddressSchema(ip_address=ip_address)
