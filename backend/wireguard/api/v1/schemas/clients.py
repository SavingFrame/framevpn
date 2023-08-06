import ipaddress
from datetime import timedelta

from pydantic import BaseModel, UUID4

from wireguard.models import WireguardInterface


class ListInterfacePeersSchema(BaseModel):
    uuid: UUID4
    description: str
    dns1: ipaddress.IPv4Address | str
    dns2: ipaddress.IPv4Address | str
    name: str
    state: str

    class Config:
        orm_mode = True


class ListClientServersSchema(BaseModel):
    uuid: UUID4
    name: str

    class Config:
        orm_mode = True


class BaseClientSchema(BaseModel):
    description: str
    dns1: ipaddress.IPv4Address | str
    dns2: ipaddress.IPv4Address | str
    name: str

    class Config:
        orm_mode = True


class CreateClientSchema(BaseClientSchema):
    interfaces: list[UUID4]


class ListClientSchema(BaseClientSchema):
    uuid: UUID4
    interfaces: list[ListClientServersSchema]

    class Config:
        orm_mode = True


class DetailClientSchema(BaseClientSchema):
    uuid: UUID4

    class Config:
        orm_mode = True


class ListClientPeerInterfaceSchema(BaseModel):
    uuid: UUID4
    name: str
    ip_address: ipaddress.IPv4Network | str

    class Config:
        orm_mode = True


class ListClientPeerSchema(BaseModel):
    client_id: UUID4
    interface: ListClientPeerInterfaceSchema
    last_online: timedelta
    ip_address: ipaddress.IPv4Address | str | None

    class Config:
        orm_mode = True


class CreateClientPeerSchema(BaseModel):
    ip_address: ipaddress.IPv4Address
    interface_id: UUID4

    class Config:
        orm_mode = True
