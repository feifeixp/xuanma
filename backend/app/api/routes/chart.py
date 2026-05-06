"""Chart calculation endpoints"""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Query
from pydantic import BaseModel

from app.core.engine import calculate_chart

router = APIRouter()


class ChartRequest(BaseModel):
    datetime: str  # ISO 8601 format, e.g. "2026-05-06T14:00:00+08:00"
    school: str = "zhuanpan"  # "zhuanpan" or "feipan" (飞盘 planned)


@router.post("/calculate")
async def calculate(request: ChartRequest):
    """Calculate Qimen Dunjia chart for a given datetime"""
    try:
        dt = datetime.fromisoformat(request.datetime)
    except ValueError as e:
        return {"error": f"Invalid datetime format: {e}"}, 400

    result = calculate_chart(dt)
    return {"chart": result}


@router.get("/current")
async def current(
    school: str = Query("zhuanpan", description="School: zhuanpan or feipan"),
):
    """Calculate Qimen Dunjia chart for the current moment"""
    result = calculate_chart()  # defaults to now
    return {"chart": result}
