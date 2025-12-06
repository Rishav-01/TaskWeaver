from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.index import router
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="TaskWeaver API")
cors_origins = [os.getenv("FRONTEND_URL")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)