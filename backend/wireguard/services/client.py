from fastapi import HTTPException
from wireguard_tools.wireguard_config import WireguardPeer

from config import settings
from database import SessionLocal
from network.services.interfaces import NetworkInterfaceService
from wireguard.api.v1.schemas.clients import CreateClientPeerSchema, CreateClientSchema
from wireguard.models import WireguardClient, WireguardInterfacePeer, WireguardInterface
from wireguard.services.server import WireguardServerService
from wireguard.utils import generate_wg_private_key, generate_wg_public_key
from wireguard_tools import WireguardDevice, WireguardKey


class WireguardClientService:

    @classmethod
    def generate_wg_config(cls, client: WireguardClient) -> str:
        wg_config = [
            '[Interface]\n' +
            f'PrivateKey = {peer.private_key}\n' +
            f'Address = {peer.ip_address}\n' +
            f'DNS = {client.dns1}, {client.dns2}\n' +
            '[Peer]\n' +
            f'PublicKey = {peer.interface.public_key}\n' +
            f'AllowedIPs = 0.0.0.0/0\n' +
            f'Endpoint = {settings.WG_ENDPOINT}:{peer.interface.listen_port}\n\n'
            for peer in client.peers]
        return '\n'.join(wg_config)

    @classmethod
    def create_peer(cls, data: CreateClientPeerSchema, client_uuid: str, db: SessionLocal) -> WireguardInterfacePeer:
        client = db.query(WireguardClient).filter(
            WireguardClient.uuid == client_uuid,
        ).first()
        interface = db.query(WireguardInterface).filter(
            WireguardInterface.uuid == data.interface_id,
        ).first()
        if not interface:
            raise HTTPException(status_code=404, detail='Interface not found')
        private_key_klass, private_key = generate_wg_private_key()
        public_key = generate_wg_public_key(private_key_klass)
        peer = WireguardInterfacePeer(
            client_id=client.uuid,
            interface=interface,
            ip_address=data.ip_address,
            private_key=private_key,
            public_key=public_key,
        )
        db.add(peer)
        db.commit()
        WireguardServerService.apply(wg_interface=interface)
        return peer

    @classmethod
    def delete_peer(cls, interface_id: str, client_id: str, db: SessionLocal):
        peer = db.query(WireguardInterfacePeer).filter(
            WireguardInterfacePeer.client_id == client_id,
            WireguardInterfacePeer.interface_id == interface_id,
        ).first()
        if not peer:
            raise HTTPException(status_code=404, detail='Peer not found')
        db.delete(peer)
        db.commit()
        WireguardServerService.apply(wg_interface=peer.interface)
        return

    @classmethod
    def create(cls, data: CreateClientSchema, db: SessionLocal) -> WireguardClient:
        interfaces = db.query(WireguardInterface).filter(WireguardInterface.uuid.in_(data.interfaces)).all()
        client = WireguardClient(
            name=data.name,
            dns1=data.dns1,
            dns2=data.dns2,
            description=data.description,
        )
        db.add(client)
        for interface in interfaces:
            private_key_klass, private_key = generate_wg_private_key()
            public_key = generate_wg_public_key(private_key_klass)
            peer = WireguardInterfacePeer(
                client=client,
                interface=interface,
                ip_address=NetworkInterfaceService.get_free_ip_address(interface),
                private_key=private_key,
                public_key=public_key,
            )
            db.add(peer)
        db.commit()
        _ = [WireguardServerService.apply(wg_interface=interface) for interface in interfaces]
        return client

    @classmethod
    def delete(cls, client_uuid: str, db: SessionLocal):
        client = db.query(WireguardClient).filter(
            WireguardClient.uuid == client_uuid,
        ).first()
        if not client:
            raise HTTPException(status_code=404, detail='Client not found')
        _ = [WireguardServerService.apply(wg_interface=interface) for interface in client.interfaces]
        db.delete(client)
        db.commit()
        return

    @classmethod
    def peer_information(cls, peer: WireguardInterfacePeer) -> WireguardPeer | None:
        key = WireguardKey(peer.public_key)
        try:
            return WireguardDevice.get(peer.interface.name).get_config().peers.get(key)
        except RuntimeError:
            return None
