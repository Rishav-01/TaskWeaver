from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.index import router

app = FastAPI(title="TaskWeaver API")
cors_origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)