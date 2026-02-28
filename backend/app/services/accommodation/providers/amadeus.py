"""
Amadeus Hotel provider.

Free tier (sandbox): https://developers.amadeus.com/self-service/category/hotels
  - Hotel List API  : GET /v1/reference-data/locations/hotels/by-city
  - Hotel Offers API: GET /v3/shopping/hotel-offers
  - Quota           : 500 calls/month in sandbox; unlimited in production
  - Auth            : OAuth2 client_credentials (token lasts 30 min)

Switch from sandbox → production:
  1. Change AMADEUS_BASE_URL to https://api.amadeus.com
  2. Provide production AMADEUS_CLIENT_ID / AMADEUS_CLIENT_SECRET

IATA city codes are required by Amadeus. Cities without airports (Manali, Rishikesh,
Coorg, etc.) return no results — the aggregator then falls through to the next provider.
"""

from __future__ import annotations

import time
import logging
from dataclasses import dataclass
from datetime import date

import httpx

from app.services.accommodation.base import (
    AccommodationOption,
    AccommodationProvider,
    AccommodationSearchParams,
    AccomType,
    PriceRange,
    _price_range_from_inr,
)
from app.core.config import get_settings

log = logging.getLogger(__name__)

# ── IATA city code lookup for Indian destinations ──────────────────────────────
# Covers airports. Mountain/rural destinations won't have a code — that's expected.
CITY_TO_IATA: dict[str, str] = {
    "delhi": "DEL", "new delhi": "DEL",
    "mumbai": "BOM", "bombay": "BOM",
    "bangalore": "BLR", "bengaluru": "BLR",
    "chennai": "MAA", "madras": "MAA",
    "kolkata": "CCU", "calcutta": "CCU",
    "hyderabad": "HYD",
    "ahmedabad": "AMD",
    "pune": "PNQ",
    "goa": "GOI", "panaji": "GOI", "north goa": "GOI", "south goa": "GOI",
    "jaipur": "JAI",
    "lucknow": "LKO",
    "kochi": "COK", "cochin": "COK",
    "thiruvananthapuram": "TRV", "trivandrum": "TRV",
    "coimbatore": "CJB",
    "bhubaneswar": "BBI",
    "vadodara": "BDQ",
    "amritsar": "ATQ",
    "varanasi": "VNS", "banaras": "VNS",
    "agra": "AGR",
    "chandigarh": "IXC",
    "leh": "IXL", "ladakh": "IXL",
    "srinagar": "SXR", "kashmir": "SXR",
    "patna": "PAT",
    "ranchi": "IXR",
    "raipur": "RPR",
    "nagpur": "NAG",
    "indore": "IDR",
    "bhopal": "BHO",
    "jodhpur": "JDH",
    "udaipur": "UDR",
    "jaisalmer": "JSA",
    "darjeeling": "IXB",   # Bagdogra (nearest)
    "siliguri": "IXB",
    "guwahati": "GAU",
    "imphal": "IMF",
    "port blair": "IXZ", "andaman": "IXZ",
    "tirupati": "TIR",
    "madurai": "IXM",
    "tiruchirappalli": "TRZ", "trichy": "TRZ",
    "vishakhapatnam": "VTZ", "vizag": "VTZ",
    "mangalore": "IXE",
    "hubli": "HBX",
    "aurangabad": "IXU",
    "dibrugarh": "DIB",
    "jorhat": "JRH",
}


def _resolve_iata(city: str) -> str | None:
    return CITY_TO_IATA.get(city.lower().strip())


@dataclass
class _TokenCache:
    token: str = ""
    expires_at: float = 0.0

    def is_valid(self) -> bool:
        return bool(self.token) and time.time() < self.expires_at - 60


_token_cache = _TokenCache()


class AmadeusHotelProvider(AccommodationProvider):
    """
    Uses two Amadeus endpoints:
      1. Hotel List   → discover hotel IDs in the city
      2. Hotel Offers → fetch availability + pricing for those IDs
    """

    @property
    def name(self) -> str:
        return "amadeus"

    @property
    def is_available(self) -> bool:
        s = get_settings()
        return bool(s.amadeus_client_id and s.amadeus_client_secret)

    async def _get_token(self) -> str:
        if _token_cache.is_valid():
            return _token_cache.token

        s = get_settings()
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                f"{s.amadeus_base_url}/v1/security/oauth2/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": s.amadeus_client_id,
                    "client_secret": s.amadeus_client_secret,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            resp.raise_for_status()
            body = resp.json()
            _token_cache.token = body["access_token"]
            _token_cache.expires_at = time.time() + body["expires_in"]
            return _token_cache.token

    async def _list_hotels(
        self, city_code: str, token: str, radius: int = 20
    ) -> list[str]:
        """Return up to 20 hotel IDs for the given IATA city code."""
        s = get_settings()
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{s.amadeus_base_url}/v1/reference-data/locations/hotels/by-city",
                params={"cityCode": city_code, "radius": radius, "radiusUnit": "KM"},
                headers={"Authorization": f"Bearer {token}"},
            )
            if resp.status_code != 200:
                return []
            data = resp.json().get("data", [])
            return [h["hotelId"] for h in data[:20]]

    async def _fetch_offers(
        self,
        hotel_ids: list[str],
        check_in: date,
        check_out: date,
        adults: int,
        token: str,
    ) -> list[dict]:
        """Fetch offers/pricing for given hotel IDs."""
        s = get_settings()
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.get(
                f"{s.amadeus_base_url}/v3/shopping/hotel-offers",
                params={
                    "hotelIds": ",".join(hotel_ids),
                    "checkInDate": check_in.isoformat(),
                    "checkOutDate": check_out.isoformat(),
                    "adults": adults,
                    "currency": "INR",
                    "bestRateOnly": "true",
                },
                headers={"Authorization": f"Bearer {token}"},
            )
            if resp.status_code != 200:
                return []
            return resp.json().get("data", [])

    def _map_offer(self, offer_data: dict) -> AccommodationOption | None:
        try:
            hotel = offer_data["hotel"]
            offers = offer_data.get("offers", [{}])
            best = offers[0] if offers else {}

            price_obj = best.get("price", {})
            total_str = price_obj.get("total") or price_obj.get("base", "0")
            nights = max(
                (
                    date.fromisoformat(best.get("checkOutDate", "2025-01-02"))
                    - date.fromisoformat(best.get("checkInDate", "2025-01-01"))
                ).days,
                1,
            )
            price_per_night = int(float(total_str) / nights) if total_str else None

            amenity_codes: list[str] = hotel.get("amenities", [])
            amenity_map = {
                "SWIMMING_POOL": "Pool", "WIFI": "Free Wi-Fi",
                "PARKING": "Parking", "RESTAURANT": "Restaurant",
                "FITNESS_CENTER": "Gym", "SPA": "Spa",
                "AIR_CONDITIONING": "AC", "PETS_ALLOWED": "Pet-friendly",
                "ROOM_SERVICE": "Room service",
            }
            amenities = [amenity_map[a] for a in amenity_codes if a in amenity_map]

            return AccommodationOption(
                id=hotel.get("hotelId", ""),
                name=hotel.get("name", "Unknown Hotel"),
                type=AccomType.hotel,
                provider=self.name,
                address=hotel.get("address", {}).get("lines", [""])[0] or "",
                price_per_night_inr=price_per_night,
                price_range=_price_range_from_inr(price_per_night),
                rating=hotel.get("rating"),
                lat=hotel.get("latitude"),
                lng=hotel.get("longitude"),
                amenities=amenities,
                booking_url=None,   # Amadeus doesn't provide direct booking URLs
            )
        except (KeyError, ValueError, TypeError) as e:
            log.debug("amadeus offer parse error: %s", e)
            return None

    async def search(
        self, params: AccommodationSearchParams
    ) -> list[AccommodationOption]:
        try:
            city_code = params.city_code or _resolve_iata(params.city_name)
            if not city_code:
                log.debug("amadeus: no IATA code for '%s'", params.city_name)
                return []

            token = await self._get_token()
            hotel_ids = await self._list_hotels(city_code, token)
            if not hotel_ids:
                return []

            offers = await self._fetch_offers(
                hotel_ids, params.check_in, params.check_out,
                params.num_guests, token,
            )

            results = [self._map_offer(o) for o in offers]
            options = [r for r in results if r is not None]

            # Filter by budget if requested
            if params.budget_per_night_max_inr:
                options = [
                    o for o in options
                    if o.price_per_night_inr is None
                    or o.price_per_night_inr <= params.budget_per_night_max_inr
                ]

            return sorted(
                options,
                key=lambda o: (o.price_per_night_inr or 999999),
            )

        except Exception as e:
            log.warning("amadeus provider error: %s", e)
            return []
