"""
Accommodation provider abstraction layer.

To add a new provider:
  1. Create backend/app/services/accommodation/providers/yourprovider.py
  2. Implement AccommodationProvider (search + name + is_available)
  3. Add it to PROVIDER_PRIORITY in aggregator.py

No other file needs to change.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import date
from enum import Enum
from typing import Optional


class PriceRange(str, Enum):
    budget = "budget"       # < ₹1,500 / night
    mid = "mid"             # ₹1,500–5,000
    premium = "premium"     # ₹5,000–15,000
    luxury = "luxury"       # > ₹15,000


class AccomType(str, Enum):
    hotel = "hotel"
    hostel = "hostel"
    homestay = "homestay"
    resort = "resort"
    camp = "camp"
    dharamshala = "dharamshala"
    guesthouse = "guesthouse"
    villa = "villa"


def _price_range_from_inr(price: Optional[int]) -> PriceRange:
    if price is None:
        return PriceRange.mid
    if price < 1500:
        return PriceRange.budget
    if price < 5000:
        return PriceRange.mid
    if price < 15000:
        return PriceRange.premium
    return PriceRange.luxury


@dataclass
class AccommodationSearchParams:
    """Inputs to every provider's search() method."""

    city_name: str                          # "Manali", "Spiti Valley"
    check_in: date
    check_out: date
    num_guests: int = 1
    budget_per_night_max_inr: Optional[int] = None
    preferred_types: list[AccomType] = field(default_factory=list)
    # Optional — providers that support geo-radius search use these
    lat: Optional[float] = None
    lng: Optional[float] = None
    # IATA city code, populated by aggregator when known
    city_code: Optional[str] = None


@dataclass
class AccommodationOption:
    """
    A single accommodation option returned by a provider.
    All monetary values are in INR.
    """

    id: str                                 # provider-scoped unique ID
    name: str
    type: AccomType
    provider: str                           # 'amadeus' | 'opentripmap' | 'mock'
    address: str
    price_range: PriceRange
    price_per_night_inr: Optional[int] = None
    rating: Optional[float] = None          # 0–5
    review_count: int = 0
    lat: Optional[float] = None
    lng: Optional[float] = None
    amenities: list[str] = field(default_factory=list)
    booking_url: Optional[str] = None
    image_url: Optional[str] = None
    distance_km: Optional[float] = None    # from destination centre


class AccommodationProvider(ABC):
    """
    Abstract base for every accommodation data source.

    Implementing a new provider:
      - Override `name`, `is_available`, and `search`
      - search() must return [] on any error (never raise to the aggregator)
      - All prices must be converted to INR before returning
    """

    @property
    @abstractmethod
    def name(self) -> str: ...

    @property
    @abstractmethod
    def is_available(self) -> bool:
        """Return False when required credentials are missing."""
        ...

    @abstractmethod
    async def search(
        self, params: AccommodationSearchParams
    ) -> list[AccommodationOption]: ...
