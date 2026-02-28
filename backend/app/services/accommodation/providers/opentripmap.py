"""
OpenTripMap provider.

API: https://opentripmap.io/docs
Free tier: 1,000 calls/day — no credit card required
Get a key: https://opentripmap.io/register

What it provides:
  - Lodging listings (hotels, hostels, guesthouses) near coordinates
  - OSM-sourced data: name, coordinates, category, OSM ID
  - Popularity/rate score (0–3 stars, based on Wikipedia/Wikidata presence)
  - No pricing data — price_per_night_inr will always be None

When it's the best choice:
  - Destinations without an IATA code (Manali, Rishikesh, Spiti, Coorg, Hampi, etc.)
  - When Amadeus returns no results
  - When you only need location discovery, not pricing

The aggregator falls through to Mock when this provider has no key configured.

To replace with a different geo-based lodging API (e.g. Foursquare, Here Places):
  - Implement AccommodationProvider in a new file
  - Swap it in PROVIDER_PRIORITY in aggregator.py
"""

from __future__ import annotations

import logging
from dataclasses import dataclass

import httpx

from app.services.accommodation.base import (
    AccommodationOption,
    AccommodationProvider,
    AccommodationSearchParams,
    AccomType,
    PriceRange,
)
from app.core.config import get_settings

log = logging.getLogger(__name__)

BASE_URL = "https://api.opentripmap.com/0.1/en"

# OpenTripMap kinds that correspond to lodging
LODGING_KINDS = "accomodations"   # OTM uses this (intentional typo in their API)

# OTM rate → stars mapping
OTM_RATE_STARS = {0: None, 1: 2.0, 2: 3.5, 3: 4.5}

# OTM kinds → AccomType
KIND_MAP: dict[str, AccomType] = {
    "hotels": AccomType.hotel,
    "hostels": AccomType.hostel,
    "guest_houses": AccomType.guesthouse,
    "camp_sites": AccomType.camp,
    "caravan_sites": AccomType.camp,
}


def _infer_type(kinds: str) -> AccomType:
    for k, t in KIND_MAP.items():
        if k in kinds:
            return t
    return AccomType.hotel


# ── Geocoding lookup table for popular Indian destinations ─────────────────────
# Used when lat/lng are not provided in the search params.
# Coordinates are destination-centre approximations.
DESTINATION_COORDS: dict[str, tuple[float, float]] = {
    "manali": (32.2396, 77.1887),
    "old manali": (32.2521, 77.1743),
    "rishikesh": (30.0869, 78.2676),
    "haridwar": (29.9457, 78.1642),
    "kasol": (32.0100, 77.3200),
    "kheerganga": (32.0852, 77.3602),
    "spiti valley": (32.2464, 78.0337),
    "kaza": (32.2270, 78.0718),
    "coorg": (12.3375, 75.8069),
    "madikeri": (12.4244, 75.7382),
    "hampi": (15.3350, 76.4600),
    "pushkar": (26.4899, 74.5511),
    "mcleod ganj": (32.2396, 76.3234),
    "dharamshala": (32.2190, 76.3234),
    "darjeeling": (27.0360, 88.2627),
    "ooty": (11.4102, 76.6950),
    "kodaikanal": (10.2381, 77.4892),
    "munnar": (10.0889, 77.0595),
    "alleppey": (9.4981, 76.3388),
    "alappuzha": (9.4981, 76.3388),
    "varkala": (8.7379, 76.7163),
    "pondicherry": (11.9416, 79.8083),
    "ziro valley": (27.5930, 93.8302),
    "majuli": (26.9500, 94.1667),
    "chopta": (30.4800, 79.2200),
    "kedarnath": (30.7346, 79.0669),
    "gangotri": (30.9942, 78.9381),
    "yamunotri": (31.0205, 78.4645),
    "badrinath": (30.7433, 79.4938),
    "vaishno devi": (32.9883, 74.9550),
    "rann of kutch": (23.7337, 70.8022),
    "gokarna": (14.5479, 74.3188),
    "wayanad": (11.6854, 76.1320),
    "coimbatore": (11.0168, 76.9558),
    "tirupati": (13.6288, 79.4192),
    "jim corbett": (29.5300, 78.7747),
    "ranthambore": (26.0173, 76.5026),
    "kaziranga": (26.5775, 93.1711),
    "meghalaya": (25.4670, 91.3662),
    "shillong": (25.5788, 91.8933),
    "cherrapunji": (25.2817, 91.7263),
}


def _resolve_coords(params: AccommodationSearchParams) -> tuple[float, float] | None:
    if params.lat and params.lng:
        return (params.lat, params.lng)
    key = params.city_name.lower().strip()
    return DESTINATION_COORDS.get(key)


class OpenTripMapProvider(AccommodationProvider):

    @property
    def name(self) -> str:
        return "opentripmap"

    @property
    def is_available(self) -> bool:
        return bool(get_settings().opentripmap_api_key)

    async def _fetch_places(
        self, lat: float, lng: float, radius_m: int = 5000
    ) -> list[dict]:
        key = get_settings().opentripmap_api_key
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{BASE_URL}/places/radius",
                params={
                    "radius": radius_m,
                    "lon": lng,
                    "lat": lat,
                    "kinds": LODGING_KINDS,
                    "limit": 20,
                    "format": "json",
                    "apikey": key,
                },
            )
            if resp.status_code != 200:
                log.debug("opentripmap radius search failed: %s", resp.status_code)
                return []
            return resp.json() if isinstance(resp.json(), list) else []

    async def _fetch_detail(self, xid: str) -> dict:
        key = get_settings().opentripmap_api_key
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{BASE_URL}/places/xid/{xid}",
                params={"apikey": key},
            )
            return resp.json() if resp.status_code == 200 else {}

    def _map_place(self, place: dict, detail: dict) -> AccommodationOption | None:
        name = (
            detail.get("name")
            or place.get("name")
            or detail.get("wikipedia_extracts", {}).get("title")
        )
        if not name:
            return None

        kinds = place.get("kinds", "")
        address_obj = detail.get("address", {})
        address_parts = filter(None, [
            address_obj.get("road"),
            address_obj.get("suburb"),
            address_obj.get("city") or address_obj.get("town"),
            address_obj.get("state"),
        ])
        address = ", ".join(address_parts) or params_city  # filled below

        rate = place.get("rate", 0)
        stars = OTM_RATE_STARS.get(rate)

        return AccommodationOption(
            id=place.get("xid", ""),
            name=name,
            type=_infer_type(kinds),
            provider=self.name,
            address=address,
            price_per_night_inr=None,   # OTM has no pricing data
            price_range=PriceRange.mid,  # default until pricing is available
            rating=stars,
            lat=place.get("point", {}).get("lat"),
            lng=place.get("point", {}).get("lon"),
        )

    async def search(
        self, params: AccommodationSearchParams
    ) -> list[AccommodationOption]:
        try:
            coords = _resolve_coords(params)
            if not coords:
                log.debug("opentripmap: no coordinates for '%s'", params.city_name)
                return []

            lat, lng = coords
            places = await self._fetch_places(lat, lng)
            if not places:
                return []

            results: list[AccommodationOption] = []
            # Fetch details for top 10 to get addresses (limit API calls)
            for place in places[:10]:
                xid = place.get("xid", "")
                detail = await self._fetch_detail(xid) if xid else {}

                option = self._map_place(place, detail)
                if option:
                    # Patch address with city name if blank
                    if not option.address:
                        option.address = params.city_name
                    results.append(option)

            return results

        except Exception as e:
            log.warning("opentripmap provider error: %s", e)
            return []
