from fastapi import FastAPI
from routes.index import router

app = FastAPI(title="TaskWeaver API")

app.include_router(router)