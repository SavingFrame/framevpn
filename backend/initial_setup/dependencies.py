from fastapi import HTTPException

from config import settings


def is_configured():
    if not settings.IS_CONFIGURED:
        raise HTTPException(status_code=400, detail='Initial setup not configured')

