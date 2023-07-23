import ipaddress
from typing import Union

from pydantic import BaseModel, IPvAnyAddress, UUID4


class BaseWireguardInterfaceSchema(BaseModel):
    name: str
    description: str
    ip_address: ipaddress.IPv4Interface
    listen_port: int

    class Config:
        orm_mode = True


class ListWireguardInterfaceSchema(BaseWireguardInterfaceSchema):
    uuid: UUID4
    state: str
    count_peers: int


class DetailWireguardInterfaceSchema(BaseWireguardInterfaceSchema):
    uuid: UUID4
    state: str
    gateway_interface: str
    on_up: list[str]
    on_down: list[str]


class ListInterfacePeersSchema(BaseModel):
    uuid: UUID4
    description: str
    dns1: ipaddress.IPv4Address | str
    dns2: ipaddress.IPv4Address | str
    name: str
    state: str

    class Config:
        orm_mode = True


class CreateWireguardInterfaceSchema(BaseWireguardInterfaceSchema):
    on_up: list[str]
    on_down: list[str]
    gateway_interface: str


class CreateDefaultValuesResponseSchema(BaseModel):
    name: str
    gateway_interface: str | None
    ip_address: ipaddress.IPv4Interface
    on_up: list[str]
    on_down: list[str]
    port_number: int | None
