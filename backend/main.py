import uvicorn
from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from fastapi_pagination import add_pagination
from starlette import status
from starlette.middleware.cors import CORSMiddleware

from auth.dependencies import get_current_active_user
from auth.views import auth_router
from config import settings
from network.views import network_router
from user.views import users_router
from wireguard.views import wireguard_router

# from src.core.celery_app import celery_app

app = FastAPI(
    title=settings.PROJECT_NAME,
    docs_url='/api/docs',
    openapi_url='/api',
    swagger_ui_parameters={
        'persistAuthorization': True,
    }
)
add_pagination(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@AuthJWT.load_config
def get_config():
    return settings


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": exc.message}
    )


# @app.middleware('http')
# async def db_session_middleware(request: Request, call_next):
#     request.state.db = SessionLocal()
#     response = await call_next(request)
#     request.state.db.close()
#     return response


# @app.get('/api/v1/task')
# async def example_task():
#     celery_app.send_task('app.tasks.example_task', args=['Hello World'])
#
#     return {'message': 'success'}


# Routers
app.include_router(
    users_router,
    prefix='/api/v1',
    tags=['users'],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(auth_router, prefix='/api', tags=['auth'])
app.include_router(
    network_router,
    prefix='/api/v1/network',
    tags=['network'],
    dependencies=[Depends(get_current_active_user)]
)
app.include_router(
    wireguard_router,
    prefix='/api/v1/wireguard',
    tags=['wireguard'],
    dependencies=[Depends(get_current_active_user)]
)

if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', reload=True, port=8000)
