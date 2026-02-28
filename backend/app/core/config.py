from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # App
    app_env: str = "development"
    app_secret_key: str = "change-me"
    log_level: str = "INFO"

    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str

    # AI
    anthropic_api_key: str
    openai_api_key: str = ""
    google_ai_api_key: str = ""

    # Booking APIs
    amadeus_client_id: str = ""
    amadeus_client_secret: str = ""
    amadeus_base_url: str = "https://test.api.amadeus.com"

    railyatri_api_key: str = ""
    railyatri_base_url: str = "https://api.railyatri.in"

    redbus_api_key: str = ""
    booking_com_affiliate_id: str = ""
    booking_com_api_key: str = ""

    # Social
    instagram_app_id: str = ""
    instagram_app_secret: str = ""
    youtube_api_key: str = ""
    youtube_client_id: str = ""
    youtube_client_secret: str = ""
    facebook_app_id: str = ""
    facebook_app_secret: str = ""

    # Infrastructure
    redis_url: str = "redis://localhost:6379/0"
    r2_account_id: str = ""
    r2_access_key_id: str = ""
    r2_secret_access_key: str = ""
    r2_bucket_name: str = "xplor360-media"
    r2_public_url: str = ""

    # Payments
    razorpay_key_id: str = ""
    razorpay_key_secret: str = ""

    # External
    google_maps_api_key: str = ""
    openweather_api_key: str = ""

    # ── Accommodation providers ─────────────────────────────────────────────────
    # A missing key causes the provider to report is_available=False and be skipped.
    # Mock provider is always available as the final fallback — no key needed.

    # OpenTripMap: 100% free, 1,000 calls/day, no credit card required
    # Sign up: https://opentripmap.io/register
    opentripmap_api_key: str = ""

    # Foursquare Places API: free tier, 1,000 calls/day
    # Sign up: https://foursquare.com/developers/
    # Wire up by adding FoursquarePlacesProvider to aggregator.PROVIDER_PRIORITY
    foursquare_api_key: str = ""

    # Booking.com & Amadeus keys already above — reused for accommodation search

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
