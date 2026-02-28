"""
AccommodationService — provider priority chain.

Provider order (highest to lowest priority):
  1. Amadeus   — real pricing, requires IATA city code + credentials
  2. OpenTripMap — location discovery, no pricing, requires API key
  3. Mock      — always available, realistic Indian hotel data, dev/fallback

The service tries providers in order and returns the first non-empty result.
If all providers return empty lists, it returns the mock result (guaranteed non-empty).

──────────────────────────────────────────────────────────────────────────────
To add a new provider (e.g. MakeMyTrip Affiliate, Expedia API):

  1. Create  app/services/accommodation/providers/mymmt.py
  2. Implement AccommodationProvider
  3. Add it to PROVIDER_PRIORITY below (higher index = lower priority)
  4. Add its credentials to core/config.py and .env.example
  Nothing else needs to change.
──────────────────────────────────────────────────────────────────────────────
"""

from __future__ import annotations

import asyncio
import logging
from datetime import date

from app.services.accommodation.base import (
    AccommodationOption,
    AccommodationProvider,
    AccommodationSearchParams,
    AccomType,
)
from app.services.accommodation.providers.amadeus import AmadeusHotelProvider
from app.services.accommodation.providers.opentripmap import OpenTripMapProvider
from app.services.accommodation.providers.mock import MockAccommodationProvider

log = logging.getLogger(__name__)

# ── Change this list to swap, add, or reorder providers ───────────────────────
PROVIDER_PRIORITY: list[AccommodationProvider] = [
    AmadeusHotelProvider(),
    OpenTripMapProvider(),
    MockAccommodationProvider(),     # Always last — guaranteed fallback
]


class AccommodationService:
    """
    Searches accommodation across all available providers.

    Usage:
        service = AccommodationService()
        options = await service.search(params)
    """

    def __init__(self, providers: list[AccommodationProvider] = PROVIDER_PRIORITY):
        self._providers = providers

    async def search(
        self, params: AccommodationSearchParams
    ) -> list[AccommodationOption]:
        """
        Try each available provider in priority order.
        Returns results from the first provider that returns >= 1 option.
        Falls back to mock (always the last provider) if all others fail.
        """
        for provider in self._providers:
            if not provider.is_available:
                log.debug("accommodation: skipping unavailable provider '%s'", provider.name)
                continue
            try:
                results = await provider.search(params)
                if results:
                    log.info(
                        "accommodation: '%s' returned %d options for '%s'",
                        provider.name, len(results), params.city_name,
                    )
                    return results
                log.debug("accommodation: '%s' returned no results", provider.name)
            except Exception as e:
                log.warning("accommodation: provider '%s' raised: %s", provider.name, e)

        # Should never reach here (Mock always returns something), but be safe
        return []

    async def search_multi(
        self,
        locations: list[str],
        check_in: date,
        check_out: date,
        num_guests: int = 1,
        budget_per_night_max_inr: int | None = None,
        preferred_types: list[AccomType] | None = None,
    ) -> dict[str, list[AccommodationOption]]:
        """
        Search accommodation for multiple overnight locations in parallel.
        Returns a mapping of {location_name: [options]}.

        Used by ItineraryAgent to enrich multiple unique overnight stops in one call.
        """
        tasks = {
            loc: self.search(
                AccommodationSearchParams(
                    city_name=loc,
                    check_in=check_in,
                    check_out=check_out,
                    num_guests=num_guests,
                    budget_per_night_max_inr=budget_per_night_max_inr,
                    preferred_types=preferred_types or [],
                )
            )
            for loc in locations
        }

        results = await asyncio.gather(*tasks.values(), return_exceptions=True)

        output: dict[str, list[AccommodationOption]] = {}
        for loc, result in zip(tasks.keys(), results):
            if isinstance(result, Exception):
                log.warning("search_multi failed for '%s': %s", loc, result)
                output[loc] = []
            else:
                output[loc] = result  # type: ignore[assignment]

        return output


# ── Convenience singleton ──────────────────────────────────────────────────────
_service: AccommodationService | None = None


def get_accommodation_service() -> AccommodationService:
    global _service
    if _service is None:
        _service = AccommodationService()
    return _service
