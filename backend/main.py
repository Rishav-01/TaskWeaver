from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.index import router
from auth import auth_router

app = FastAPI(title="TaskWeaver API")
cors_origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(auth_router)