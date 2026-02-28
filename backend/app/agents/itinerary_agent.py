"""
ItineraryAgent — converts a traveler's intent into a fully enriched itinerary.

Pipeline:
  1. LLM call (Claude) — generates day-by-day plan with accommodation_suggestions
  2. Accommodation API search — runs in parallel with step 1 for destinations we
     already know from the request; then enriches per-day overnight locations
     discovered in the LLM response
  3. Merge — attach live AccommodationOption results to each ItineraryDay

The accommodation layer is injected via AccommodationService, so swapping
providers (Amadeus → Booking.com, etc.) requires no changes here.
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
from datetime import date, timedelta
from pathlib import Path

from app.models.trip import (
    AccommodationOption,
    AccommodationSuggestion,
    Activity,
    ItineraryDay,
    ItineraryRequest,
    ItineraryResponse,
    PackingItem,
)
from app.services.accommodation import (
    AccommodationSearchParams,
    AccomType,
    get_accommodation_service,
)
from app.services.llm import CLAUDE_PRIMARY, complete_json

log = logging.getLogger(__name__)
PROMPTS_DIR = Path(__file__).parent.parent.parent.parent / "prompts"


# ── Helpers ────────────────────────────────────────────────────────────────────

def _load_prompt(filename: str) -> str:
    path = PROMPTS_DIR / filename
    return path.read_text() if path.exists() else ""


def _per_night_budget(req: ItineraryRequest) -> int | None:
    """Derive a per-night accommodation budget from the total trip budget."""
    if not req.budget_inr:
        return None
    nights = max((req.end_date - req.start_date).days, 1)
    # Assume ~30% of total budget is accommodation
    return int(req.budget_inr * 0.30 / nights)


def _preferred_accom_types(req: ItineraryRequest) -> list[AccomType]:
    if req.accommodation_type:
        try:
            return [AccomType(req.accommodation_type.value)]
        except ValueError:
            pass
    # Infer from travel style
    style_map = {
        "budget": [AccomType.hostel, AccomType.guesthouse, AccomType.dharamshala],
        "luxury": [AccomType.resort, AccomType.hotel, AccomType.villa],
        "adventure": [AccomType.camp, AccomType.guesthouse, AccomType.hostel],
        "pilgrimage": [AccomType.dharamshala, AccomType.guesthouse, AccomType.hotel],
        "wildlife": [AccomType.resort, AccomType.camp],
    }
    return style_map.get(req.travel_style.value, [])


def _build_user_message(req: ItineraryRequest) -> str:
    duration = (req.end_date - req.start_date).days + 1
    lines = [
        f"Plan a {duration}-day trip from {req.origin} to {req.destination}.",
        f"Travel dates: {req.start_date} to {req.end_date}",
        f"Trip type: {req.trip_type.value}, travelers: {req.num_travelers}",
        f"Travel style: {req.travel_style.value}",
    ]
    if req.budget_inr:
        lines.append(f"Total budget: INR {req.budget_inr:,}")
    if req.preferred_transport:
        modes = ", ".join(t.value for t in req.preferred_transport)
        lines.append(f"Preferred transport: {modes}")
    if req.accommodation_type:
        lines.append(f"Accommodation preference: {req.accommodation_type.value}")
    if req.interests:
        lines.append(f"Interests: {', '.join(req.interests)}")
    if req.avoid:
        lines.append(f"Avoid: {', '.join(req.avoid)}")

    lines.append(
        "\nReturn a JSON object matching the ItineraryResponse schema exactly. "
        "Include realistic activities, cost estimates in INR, "
        "content_opportunity fields for ContentPilot, "
        "overnight_location and accommodation_suggestions (budget/mid/premium tiers) per day, "
        "and a packing_list tailored to the destination and season."
    )
    return "\n".join(lines)


# ── LLM response parsing ───────────────────────────────────────────────────────

def _parse_suggestions(raw: list[dict]) -> list[AccommodationSuggestion]:
    out = []
    for s in raw:
        try:
            out.append(AccommodationSuggestion(**s))
        except Exception as e:
            log.debug("suggestion parse skip: %s — %s", s, e)
    return out


def _parse_llm_response(raw: str, req: ItineraryRequest) -> ItineraryResponse:
    raw = re.sub(r"```(?:json)?|```", "", raw).strip()
    data = json.loads(raw)
    duration = (req.end_date - req.start_date).days + 1

    days: list[ItineraryDay] = []
    for i, d in enumerate(data.get("days", [])):
        activities = [Activity(**a) for a in d.get("activities", [])]
        suggestions = _parse_suggestions(d.get("accommodation_suggestions", []))
        day_date = req.start_date + timedelta(days=i)

        days.append(
            ItineraryDay(
                day_number=d.get("day_number", i + 1),
                date=day_date,
                title=d.get("title", f"Day {i + 1}"),
                summary=d.get("summary", ""),
                activities=activities,
                transport_for_day=d.get("transport_for_day"),
                overnight_location=d.get("overnight_location"),
                estimated_cost_inr=d.get("estimated_cost_inr"),
                weather_note=d.get("weather_note"),
                accommodation_suggestions=suggestions,
                accommodation_options=[],  # filled in _enrich_with_live_options
            )
        )

    return ItineraryResponse(
        destination=req.destination,
        origin=req.origin,
        start_date=req.start_date,
        end_date=req.end_date,
        duration_days=duration,
        trip_type=req.trip_type,
        travel_style=req.travel_style,
        total_estimated_cost_inr=data.get("total_estimated_cost_inr"),
        summary=data.get("summary", ""),
        days=days,
        packing_list=[PackingItem(**p) for p in data.get("packing_list", [])],
        key_tips=data.get("key_tips", []),
        best_time_note=data.get("best_time_note"),
    )


# ── Accommodation enrichment ───────────────────────────────────────────────────

def _unique_overnight_locations(days: list[ItineraryDay]) -> list[str]:
    """Deduplicate overnight locations while preserving first-seen order."""
    seen: set[str] = set()
    out: list[str] = []
    for day in days:
        loc = (day.overnight_location or "").strip()
        if loc and loc not in seen:
            seen.add(loc)
            out.append(loc)
    return out


def _map_accom_option(option) -> AccommodationOption:
    """Convert service dataclass → Pydantic model."""
    return AccommodationOption(
        id=option.id,
        name=option.name,
        type=option.type.value if hasattr(option.type, "value") else str(option.type),
        provider=option.provider,
        address=option.address,
        price_range=option.price_range.value if hasattr(option.price_range, "value") else str(option.price_range),
        price_per_night_inr=option.price_per_night_inr,
        rating=option.rating,
        review_count=option.review_count,
        lat=option.lat,
        lng=option.lng,
        amenities=option.amenities,
        booking_url=option.booking_url,
        image_url=option.image_url,
        distance_km=option.distance_km,
    )


async def _enrich_with_live_options(
    itinerary: ItineraryResponse,
    req: ItineraryRequest,
) -> ItineraryResponse:
    """
    Fetch live accommodation options for each unique overnight location
    and attach them to the relevant ItineraryDay objects.

    Uses search_multi() so all locations are queried in parallel.
    """
    service = get_accommodation_service()
    locations = _unique_overnight_locations(itinerary.days)

    if not locations:
        return itinerary

    per_night_budget = _per_night_budget(req)
    preferred_types = _preferred_accom_types(req)

    # search_multi queries all locations concurrently
    results_by_location = await service.search_multi(
        locations=locations,
        check_in=req.start_date,
        check_out=req.end_date,
        num_guests=req.num_travelers,
        budget_per_night_max_inr=per_night_budget,
        preferred_types=preferred_types or None,
    )

    # Attach results to each day
    for day in itinerary.days:
        loc = (day.overnight_location or "").strip()
        if loc and loc in results_by_location:
            day.accommodation_options = [
                _map_accom_option(o) for o in results_by_location[loc]
            ]

    return itinerary


# ── Public entry point ─────────────────────────────────────────────────────────

async def generate_itinerary(req: ItineraryRequest) -> ItineraryResponse:
    """
    Full pipeline:
      LLM generation  ──┐
                         ├─► merge ──► ItineraryResponse
      (runs after LLM)  Accommodation search
    """
    system_prompt = _load_prompt("itinerary_builder.txt")
    user_message = _build_user_message(req)

    raw = await complete_json(
        prompt=user_message,
        system=system_prompt,
        model=CLAUDE_PRIMARY,
        max_tokens=8192,
    )

    itinerary = _parse_llm_response(raw, req)

    # Enrich with live accommodation options (async, provider-agnostic)
    itinerary = await _enrich_with_live_options(itinerary, req)

    return itinerary
