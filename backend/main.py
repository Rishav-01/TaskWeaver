from fastapi import FastAPI
from routes.index import router

from models.Meeting import Meeting
from models.ActionItem import ActionItem

app = FastAPI(title="TaskWeaver API")

app.include_router(router)