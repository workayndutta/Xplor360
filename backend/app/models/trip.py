from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
from datetime import date, datetime
import uuid


class TripType(str, Enum):
    solo = "solo"
    couple = "couple"
    family = "family"
    group = "group"
    expedition = "expedition"


class TravelStyle(str, Enum):
    adventure = "adventure"
    leisure = "leisure"
    pilgrimage = "pilgrimage"
    budget = "budget"
    luxury = "luxury"
    cultural = "cultural"
    wildlife = "wildlife"


class TransportMode(str, Enum):
    flight = "flight"
    train = "train"
    bus = "bus"
    cab = "cab"
    bike = "bike"
    trek = "trek"


class AccommodationType(str, Enum):
    hotel = "hotel"
    hostel = "hostel"
    homestay = "homestay"
    resort = "resort"
    camp = "camp"
    dharamshala = "dharamshala"
    guesthouse = "guesthouse"
    villa = "villa"


# ── Accommodation models ───────────────────────────────────────────────────────

class AccommodationSuggestion(BaseModel):
    """
    AI-generated accommodation suggestion for a specific price tier.
    Based on Claude's training knowledge — not a live API result.
    Treat as a recommendation, not a booking-ready listing.
    """
    tier: str = Field(..., examples=["budget", "mid", "premium", "luxury"])
    name: str = Field(..., examples=["Zostel Manali"])
    description: str
    estimated_price_per_night_inr: Optional[int] = None
    area: Optional[str] = Field(None, examples=["Old Manali"])
    notable_for: Optional[str] = Field(
        None,
        description="What makes this pick stand out for this destination",
        examples=["Best rooftop with Himalayan view"],
    )


class AccommodationOption(BaseModel):
    """
    A real accommodation option returned by the AccommodationService.
    May or may not have pricing depending on which provider served it.
    """
    id: str
    name: str
    type: str                               # AccomType value
    provider: str = Field(
        ...,
        description="Data source: 'amadeus' | 'opentripmap' | 'mock'",
    )
    address: str
    price_range: str                        # PriceRange value
    price_per_night_inr: Optional[int] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    review_count: int = 0
    lat: Optional[float] = None
    lng: Optional[float] = None
    amenities: list[str] = []
    booking_url: Optional[str] = None
    image_url: Optional[str] = None
    distance_km: Optional[float] = None


# ── Request / Response Schemas ─────────────────────────────────────────────────

class ItineraryRequest(BaseModel):
    destination: str = Field(..., examples=["Spiti Valley, Himachal Pradesh"])
    origin: str = Field(..., examples=["Delhi"])
    start_date: date
    end_date: date
    budget_inr: Optional[int] = Field(None, ge=1000, description="Total budget in INR")
    trip_type: TripType = TripType.solo
    travel_style: TravelStyle = TravelStyle.leisure
    num_travelers: int = Field(1, ge=1, le=50)
    preferred_transport: Optional[list[TransportMode]] = None
    accommodation_type: Optional[AccommodationType] = None
    interests: Optional[list[str]] = Field(
        None,
        examples=[["photography", "local food", "trekking"]],
    )
    avoid: Optional[list[str]] = Field(
        None,
        examples=[["crowded tourist spots"]],
    )


class Activity(BaseModel):
    time: str = Field(..., examples=["09:00"])
    title: str
    description: str
    location: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    duration_minutes: Optional[int] = None
    cost_inr: Optional[int] = None
    booking_url: Optional[str] = None
    content_opportunity: Optional[str] = Field(
        None,
        description="ContentPilot shot suggestion for this activity",
    )


class ItineraryDay(BaseModel):
    day_number: int
    date: Optional[date] = None
    title: str = Field(..., examples=["Arrival in Kaza — First Glimpse of Spiti"])
    summary: str
    activities: list[Activity]
    transport_for_day: Optional[str] = None
    estimated_cost_inr: Optional[int] = None
    weather_note: Optional[str] = None

    # ── Accommodation ──────────────────────────────────────────────────────────
    # overnight_location: the town/village where the traveler sleeps this night.
    # Used by ItineraryAgent to group days by stay location for the API search.
    overnight_location: Optional[str] = Field(
        None,
        description="Town/city name where the traveler stays overnight",
        examples=["Kaza"],
    )

    # Claude's structured recommendations (budget / mid / premium tiers).
    # These come from the LLM and are based on training knowledge, not live data.
    accommodation_suggestions: list[AccommodationSuggestion] = Field(
        default=[],
        description="AI-curated picks across price tiers for this overnight stop",
    )

    # Real listings from AccommodationService (Amadeus → OpenTripMap → Mock).
    accommodation_options: list[AccommodationOption] = Field(
        default=[],
        description="Live / mock listings with real amenities and pricing",
    )


class PackingItem(BaseModel):
    category: str
    item: str
    essential: bool = True


class ItineraryResponse(BaseModel):
    itinerary_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    destination: str
    origin: str
    start_date: date
    end_date: date
    duration_days: int
    trip_type: TripType
    travel_style: TravelStyle
    total_estimated_cost_inr: Optional[int] = None
    summary: str
    days: list[ItineraryDay]
    packing_list: list[PackingItem] = []
    key_tips: list[str] = []
    best_time_note: Optional[str] = None
    generated_at: datetime = Field(default_factory=datetime.utcnow)


class TripCreate(BaseModel):
    itinerary_id: Optional[str] = None
    destination: str
    start_date: date
    end_date: date
    trip_type: TripType
    title: Optional[str] = None


class TripResponse(BaseModel):
    id: str
    user_id: str
    destination: str
    start_date: date
    end_date: date
    trip_type: TripType
    title: str
    status: str
    created_at: datetime
