from datetime import timedelta, datetime
from typing import List

from uuid import UUID

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import INET, ARRAY
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, mapped_column, relationship, object_session
from ipaddress import IPv4Network, IPv4Address

from config import settings
from database import Base
from generic.db_types import IPNetwork, IPAddress


class WireguardInterfacePeer(Base):
    __tablename__ = 'wireguard_interface_peer'

    interface_id: Mapped[int] = mapped_column(sa.ForeignKey('wireguard_interface.uuid'), primary_key=True)
    client_id: Mapped[int] = mapped_column(sa.ForeignKey('wireguard_client.uuid'), primary_key=True)
    interface: Mapped["WireguardInterface"] = relationship(back_populates='peers')
    client: Mapped["WireguardClient"] = relationship(back_populates='peers')
    private_key = sa.Column(sa.String)
    public_key = sa.Column(sa.String)
    ip_address = sa.Column(IPAddress)

    @hybrid_property
    def last_online(self):
        from wireguard.services.client import WireguardClientService
        peer_information = WireguardClientService.peer_information(self)
        return datetime.fromtimestamp(peer_information.last_handshake)

    @hybrid_property
    def uuid_pk(self):
        return f'{self.interface_id}-{self.client_id}'


class WireguardServer(Base):
    __tablename__ = 'wireguard_server'

    uuid = sa.Column(sa.UUID, primary_key=True, index=True, server_default=sa.text("gen_random_uuid()"))
    endpoint = sa.Column(IPAddress, nullable=False)
    name = sa.Column(sa.String(125), unique=True, nullable=False)
    interfaces: Mapped[List["WireguardInterface"]] = relationship(
        back_populates='server',
    )


class WireguardInterface(Base):
    __tablename__ = 'wireguard_interface'

    uuid: Mapped[UUID] = mapped_column(sa.UUID, primary_key=True, index=True, server_default=sa.text("gen_random_uuid()"))
    gateway_interface: Mapped[str] = mapped_column(sa.String, default='eth0')
    description: Mapped[str] = mapped_column(sa.String, default='')
    ip_address: Mapped[IPv4Network] = mapped_column(IPNetwork)
    listen_port: Mapped[int] = mapped_column(sa.Integer)
    name: Mapped[str] = mapped_column(sa.String(125), unique=True)
    on_up: Mapped[list[str]] = mapped_column(ARRAY(sa.String), default=list)
    on_down: Mapped[list[str]] = mapped_column(ARRAY(sa.String), default=list)
    private_key: Mapped[str] = mapped_column(sa.String)
    public_key: Mapped[str] = mapped_column(sa.String)
    server_id: Mapped[str] = mapped_column(sa.ForeignKey('wireguard_server.uuid'), nullable=False)
    server: Mapped["WireguardServer"] = relationship(back_populates='interfaces')
    peers: Mapped[List["WireguardInterfacePeer"]] = relationship(
        back_populates='interface',
    )
    clients: Mapped[List["WireguardClient"]] = relationship(
        back_populates='interfaces',
        secondary='wireguard_interface_peer',
        viewonly=True,
    )

    @hybrid_property
    def count_peers(self):
        return object_session(self).query(WireguardInterfacePeer).with_parent(self).count()

    @hybrid_property
    def state(self):
        from wireguard.services.server import WireguardServerService
        return WireguardServerService.get_wg_interface_status(self.name)

    @hybrid_property
    def filepath(self):
        return settings.BASE_DIR.joinpath('data', 'interfaces', f'{self.name}.conf')


class WireguardClient(Base):
    __tablename__ = 'wireguard_client'

    uuid: Mapped[UUID] = mapped_column(sa.UUID, primary_key=True, index=True, server_default=sa.text("gen_random_uuid()"))
    name: Mapped[str] = mapped_column(sa.String)
    description: Mapped[str] = mapped_column(sa.String)
    dns1: Mapped[IPv4Address] = mapped_column(IPAddress, default='8.8.8.8')
    dns2: Mapped[IPv4Address] = mapped_column(IPAddress, default='8.8.4.4')
    peers: Mapped[List[WireguardInterfacePeer]] = relationship(back_populates='client')
    interfaces: Mapped[List[WireguardInterface]] = relationship(
        back_populates='clients',
        secondary='wireguard_interface_peer',
        viewonly=True,
    )
