from pydantic import BaseModel


class WireguardInterfaceSchema(BaseModel):
    id: int
    status: bool | None
