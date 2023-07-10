from pydantic import BaseModel, IPvAnyAddress


class InterfaceSchema(BaseModel):
    id: int
    state: bool | None
    ip_address: IPvAnyAddress | None
    name: str
    mac_address: str
