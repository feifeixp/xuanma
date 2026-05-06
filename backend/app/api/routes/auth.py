"""Authentication endpoints (placeholder — full impl in Phase 2)"""

from fastapi import APIRouter

router = APIRouter()


@router.post("/register")
async def register():
    return {"message": "Registration coming in Phase 2"}


@router.post("/login")
async def login():
    return {"message": "Login coming in Phase 2"}
