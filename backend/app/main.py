"""FastAPI application factory"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import chart, ai, auth


def create_app() -> FastAPI:
    app = FastAPI(
        title="玄码 (XuanMa) — 奇门遁甲 API",
        description="Qimen Dunjia chart calculation & AI interpretation",
        version="0.1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Cloudflare Pages + Tunnel
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(chart.router, prefix="/api/chart", tags=["Chart"])
    app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
    app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])

    @app.get("/api/health")
    async def health():
        return {"status": "ok", "name": "玄码 XuanMa"}

    return app


app = create_app()
