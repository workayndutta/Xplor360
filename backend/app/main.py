from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog

from app.core.config import get_settings
from app.api.routes import health, itinerary

log = structlog.get_logger()

settings = get_settings()

app = FastAPI(
    title="Xplor360 API",
    description="AI-powered travel planning and content creation platform for Indian travelers.",
    version="0.1.0",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
)

# ── CORS ────────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=(
        ["*"] if not settings.is_production
        else ["https://xplor360.in", "https://www.xplor360.in"]
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ──────────────────────────────────────────────────────────────────────
app.include_router(health.router)
app.include_router(itinerary.router, prefix="/api/v1")

# Future routers (uncomment as modules are built):
# app.include_router(trips.router, prefix="/api/v1")
# app.include_router(bookings.router, prefix="/api/v1")
# app.include_router(expeditions.router, prefix="/api/v1")
# app.include_router(content.router, prefix="/api/v1")
# app.include_router(publishing.router, prefix="/api/v1")
# app.include_router(analytics.router, prefix="/api/v1")
# app.include_router(users.router, prefix="/api/v1")


@app.on_event("startup")
async def startup():
    log.info("xplor360_api_started", env=settings.app_env)
