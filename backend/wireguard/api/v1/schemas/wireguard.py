import ipaddress

from pydantic import BaseModel, UUID4


class ServerWireguardInterfaceSchema(BaseModel):
    uuid: UUID4
    endpoint: ipaddress.IPv4Address
    name: str

    class Config:
        orm_mode = True


class BaseWireguardInterfaceSchema(BaseModel):
    name: str
    description: str
    ip_address: ipaddress.IPv4Network
    listen_port: int

    class Config:
        orm_mode = True


class ListWireguardInterfaceSchema(BaseWireguardInterfaceSchema):
    uuid: UUID4
    state: str
    count_peers: int
    server: ServerWireguardInterfaceSchema


class DetailWireguardInterfaceSchema(BaseWireguardInterfaceSchema):
    uuid: UUID4
    state: str
    gateway_interface: str
    on_up: list[str]
    on_down: list[str]
    server: ServerWireguardInterfaceSchema


class CreateWireguardInterfaceSchema(BaseWireguardInterfaceSchema):
    on_up: list[str]
    on_down: list[str]
    gateway_interface: str


class CreateDefaultValuesResponseSchema(BaseModel):
    name: str
    gateway_interface: str | None
    ip_address: ipaddress.IPv4Network
    on_up: list[str]
    on_down: list[str]
    port_number: int | None


class IptablesRulesSchema(BaseModel):
    on_up: list[str]
    on_down: list[str]


class FreeIpAddressSchema(BaseModel):
    ip_address: ipaddress.IPv4Address | None

    class Config:
        orm_mode = True
