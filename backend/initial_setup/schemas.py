from typing import Any

from pydantic import BaseModel, root_validator


class CaseInsensitiveModel(BaseModel):
    @root_validator(pre=True)
    def __lowercase_property_keys__(cls, values: Any) -> Any:
        def __lower__(value: Any) -> Any:
            if isinstance(value, dict):
                return {k.lower(): __lower__(v) for k, v in value.items()}
            return value

        return __lower__(values)


class ConfigSchema(CaseInsensitiveModel):
    wg_bin: str
    wg_quick_bin: str
    iptables_bin: str
    wg_endpoint: str
    is_configured: bool = True
    server_name: str

    class Config:
        orm_mode = True
        case_sensitive = False
