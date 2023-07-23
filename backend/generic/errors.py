from fastapi import HTTPException


class WireguardError(HTTPException):
    pass
