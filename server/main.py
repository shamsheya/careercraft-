import os
import json
import datetime
from datetime import timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes.auth import router as auth_router

app = FastAPI(title='CareerCraft API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth_router)


@app.get('/api/health')
async def health():
    return {'status': 'ok', 'timestamp': datetime.datetime.utcnow().isoformat()}


dist_path = os.path.join(os.path.dirname(__file__), '..', 'dist')
if os.path.exists(dist_path):
    app.mount('/', StaticFiles(directory=dist_path, html=True), name='static')
