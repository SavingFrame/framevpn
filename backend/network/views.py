import typing as t

from fastapi import APIRouter, Depends

from auth.dependencies import get_current_active_superuser
from network.schemas import InterfaceSchema
from network.services.interfaces import NetworkInterfaceService

network_router = r = APIRouter()


@r.get(
    "/interfaces/",
)
async def interfaces_list(
    current_user=Depends(get_current_active_superuser),
) -> t.List[InterfaceSchema]:
    """
    Get all users
    """
    return NetworkInterfaceService.get_interfaces()