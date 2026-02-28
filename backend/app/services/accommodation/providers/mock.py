"""
Mock accommodation provider.

Always available — no API key required.
Returns curated, realistic Indian accommodation data for 30 popular destinations.

Used when:
  - Running locally without API credentials
  - In CI/test environments
  - As the final fallback in the provider chain

Data is keyed by lowercase destination name. When the city isn't in the catalogue,
a generic set of options is returned so the response is never empty.
"""

from __future__ import annotations

import uuid
from datetime import date

from app.services.accommodation.base import (
    AccommodationOption,
    AccommodationProvider,
    AccommodationSearchParams,
    AccomType,
    PriceRange,
)

# ── Catalogue ──────────────────────────────────────────────────────────────────
# Format: destination_key → list of option dicts
# price_per_night_inr is a realistic 2025 Indian market price

_CATALOGUE: dict[str, list[dict]] = {
    "manali": [
        dict(name="Zostel Manali", type=AccomType.hostel, price=600,
             rating=4.3, review_count=1840, address="Old Manali Road",
             amenities=["Free Wi-Fi", "Common kitchen", "Mountain view", "Bonfire"],
             booking_url="https://www.zostel.com/zostel/manali/"),
        dict(name="Apple Country Resort", type=AccomType.resort, price=2800,
             rating=4.1, review_count=760, address="Manali-Naggar Road",
             amenities=["Restaurant", "Free Wi-Fi", "Mountain view", "Parking"],
             booking_url=None),
        dict(name="Span Resort & Spa", type=AccomType.resort, price=8500,
             rating=4.5, review_count=420, address="Katrain, Kullu-Manali Highway",
             amenities=["Spa", "Pool", "Restaurant", "River view", "Free Wi-Fi"],
             booking_url=None),
        dict(name="Himalayan Abode", type=AccomType.homestay, price=1200,
             rating=4.6, review_count=215, address="Old Manali Village",
             amenities=["Home-cooked meals", "Apple orchard", "Free Wi-Fi"],
             booking_url=None),
    ],
    "spiti valley": [
        dict(name="Spiti Sarai", type=AccomType.guesthouse, price=1800,
             rating=4.7, review_count=340, address="Kaza, Spiti",
             amenities=["Home-cooked meals", "Bonfire", "Stargazing deck", "Free Wi-Fi"],
             booking_url=None),
        dict(name="Mudhouse Retreat", type=AccomType.homestay, price=900,
             rating=4.5, review_count=180, address="Langza Village, Spiti",
             amenities=["Traditional mud house", "Home-cooked vegetarian meals", "Stunning views"],
             booking_url=None),
        dict(name="Kaza Camp", type=AccomType.camp, price=1500,
             rating=4.2, review_count=95, address="Kaza Outskirts",
             amenities=["Attached washrooms", "Bonfire", "Dinner included"],
             booking_url=None),
    ],
    "kaza": [
        dict(name="Spiti Sarai", type=AccomType.guesthouse, price=1800,
             rating=4.7, review_count=340, address="Kaza, Spiti",
             amenities=["Home-cooked meals", "Bonfire", "Stargazing deck"],
             booking_url=None),
        dict(name="Hotel Deyzor", type=AccomType.hotel, price=1200,
             rating=4.0, review_count=210, address="Main Market, Kaza",
             amenities=["Restaurant", "Hot water", "Parking"],
             booking_url=None),
    ],
    "rishikesh": [
        dict(name="Zostel Rishikesh", type=AccomType.hostel, price=500,
             rating=4.4, review_count=2100, address="Laxman Jhula Road",
             amenities=["Ganga view", "Free Wi-Fi", "Common kitchen", "Yoga deck"],
             booking_url="https://www.zostel.com/zostel/rishikesh/"),
        dict(name="Aloha on the Ganges", type=AccomType.resort, price=4500,
             rating=4.3, review_count=580, address="Tapovan, Rishikesh",
             amenities=["Ganga view", "Yoga sessions", "Restaurant", "Spa"],
             booking_url=None),
        dict(name="Ananda in the Himalayas", type=AccomType.resort, price=28000,
             rating=4.8, review_count=320, address="Palace Estate, Narendra Nagar",
             amenities=["Luxury spa", "Pool", "Ayurveda", "Gourmet dining", "Yoga"],
             booking_url=None),
        dict(name="Vashistha Guest House", type=AccomType.guesthouse, price=800,
             rating=4.1, review_count=430, address="Swarg Ashram, Rishikesh",
             amenities=["Ganga view", "Simple rooms", "Free Wi-Fi"],
             booking_url=None),
    ],
    "goa": [
        dict(name="Zostel Goa", type=AccomType.hostel, price=550,
             rating=4.2, review_count=1650, address="Arambol, North Goa",
             amenities=["Beach access", "Bar", "Pool", "Free Wi-Fi"],
             booking_url="https://www.zostel.com/zostel/goa/"),
        dict(name="W Goa", type=AccomType.resort, price=18000,
             rating=4.7, review_count=890, address="Vagator Beach, North Goa",
             amenities=["Beach access", "Pool", "Spa", "Multiple restaurants", "DJ"],
             booking_url=None),
        dict(name="Casa de Goa", type=AccomType.villa, price=5500,
             rating=4.5, review_count=340, address="Assagao, North Goa",
             amenities=["Pool", "Portuguese architecture", "Free Wi-Fi", "Garden"],
             booking_url=None),
        dict(name="OYO 1234 Coconut Grove", type=AccomType.hotel, price=1800,
             rating=3.8, review_count=1200, address="Calangute Beach Road",
             amenities=["AC", "Free Wi-Fi", "Attached bathroom"],
             booking_url=None),
    ],
    "jaipur": [
        dict(name="Zostel Jaipur", type=AccomType.hostel, price=450,
             rating=4.3, review_count=980, address="Bani Park, Jaipur",
             amenities=["Free Wi-Fi", "Common kitchen", "Rooftop", "Heritage building"],
             booking_url="https://www.zostel.com/zostel/jaipur/"),
        dict(name="Samode Haveli", type=AccomType.hotel, price=12000,
             rating=4.6, review_count=510, address="Gangapole, Old City, Jaipur",
             amenities=["Heritage property", "Pool", "Restaurant", "Courtyard"],
             booking_url=None),
        dict(name="Rambagh Palace", type=AccomType.hotel, price=35000,
             rating=4.9, review_count=760, address="Bhawani Singh Road, Jaipur",
             amenities=["Palace", "Pool", "Spa", "Multiple restaurants", "Gardens"],
             booking_url=None),
        dict(name="Umaid Mahal", type=AccomType.hotel, price=3500,
             rating=4.2, review_count=420, address="Jacob Road, Civil Lines",
             amenities=["Free Wi-Fi", "Restaurant", "AC", "Heritage decor"],
             booking_url=None),
    ],
    "udaipur": [
        dict(name="Zostel Udaipur", type=AccomType.hostel, price=480,
             rating=4.4, review_count=760, address="Lal Ghat, Udaipur",
             amenities=["Lake view", "Rooftop cafe", "Free Wi-Fi"],
             booking_url="https://www.zostel.com/zostel/udaipur/"),
        dict(name="Taj Lake Palace", type=AccomType.hotel, price=45000,
             rating=4.9, review_count=1100, address="Lake Pichola, Udaipur",
             amenities=["Lake setting", "Pool", "Spa", "Multiple restaurants"],
             booking_url=None),
        dict(name="Raas Devigarh", type=AccomType.hotel, price=22000,
             rating=4.7, review_count=380, address="Delwara, near Udaipur",
             amenities=["Heritage palace", "Pool", "Spa", "Panoramic views"],
             booking_url=None),
        dict(name="Nukkad Guesthouse", type=AccomType.guesthouse, price=1100,
             rating=4.5, review_count=850, address="Gangaur Ghat Road",
             amenities=["Lake view", "Rooftop", "Home-cooked food", "Free Wi-Fi"],
             booking_url=None),
    ],
    "varanasi": [
        dict(name="Brijrama Palace", type=AccomType.hotel, price=12000,
             rating=4.7, review_count=620, address="Darbhanga Ghat, Varanasi",
             amenities=["Heritage palace", "Ganga view", "Restaurant", "Yoga"],
             booking_url=None),
        dict(name="Stays by Ramada Varanasi", type=AccomType.hotel, price=4500,
             rating=4.0, review_count=480, address="Nadesar Palace, Varanasi",
             amenities=["Pool", "Restaurant", "Free Wi-Fi", "Airport transfer"],
             booking_url=None),
        dict(name="Ghat View Guesthouse", type=AccomType.guesthouse, price=700,
             rating=4.2, review_count=530, address="Assi Ghat, Varanasi",
             amenities=["Ganga view", "Rooftop", "Free Wi-Fi"],
             booking_url=None),
    ],
    "coorg": [
        dict(name="Orange County Resort", type=AccomType.resort, price=18000,
             rating=4.8, review_count=540, address="Siddapur, Coorg",
             amenities=["Coffee estate", "Pool", "Spa", "Multiple dining", "Activities"],
             booking_url=None),
        dict(name="Tamara Coorg", type=AccomType.resort, price=14000,
             rating=4.6, review_count=380, address="Yavakapadi Village, Coorg",
             amenities=["Hilltop location", "Pool", "Spa", "Restaurant", "Nature walks"],
             booking_url=None),
        dict(name="Rainforest Retreat", type=AccomType.homestay, price=3500,
             rating=4.7, review_count=260, address="Galibeedu, Madikeri",
             amenities=["Organic farm", "Nature trails", "Home-cooked meals", "Wi-Fi"],
             booking_url=None),
    ],
    "ladakh": [
        dict(name="The Grand Dragon Ladakh", type=AccomType.hotel, price=7500,
             rating=4.6, review_count=480, address="Upper Tukcha Road, Leh",
             amenities=["Mountain view", "Restaurant", "Heated rooms", "Travel desk"],
             booking_url=None),
        dict(name="Zostel Leh", type=AccomType.hostel, price=700,
             rating=4.5, review_count=920, address="Fort Road, Leh",
             amenities=["Free Wi-Fi", "Common area", "Travel tips desk", "Mountain view"],
             booking_url="https://www.zostel.com/zostel/leh/"),
        dict(name="Nimmu House", type=AccomType.homestay, price=2200,
             rating=4.8, review_count=195, address="Nimmu Village, Leh",
             amenities=["Traditional Ladakhi home", "Home-cooked meals", "Stargazing"],
             booking_url=None),
        dict(name="Saboo Resorts", type=AccomType.resort, price=12000,
             rating=4.4, review_count=220, address="Saboo Village, Leh",
             amenities=["Heated rooms", "Restaurant", "Mountain view", "Garden"],
             booking_url=None),
    ],
    "hampi": [
        dict(name="Zostel Hampi", type=AccomType.hostel, price=450,
             rating=4.6, review_count=1240, address="Virupapur Gaddi, Hampi",
             amenities=["River view", "Rooftop", "Free Wi-Fi", "Chill vibe"],
             booking_url="https://www.zostel.com/zostel/hampi/"),
        dict(name="Evolve Back Kamlapura Palace", type=AccomType.resort, price=22000,
             rating=4.8, review_count=290, address="Kamlapura, Hampi",
             amenities=["Heritage", "Pool", "Spa", "Gourmet restaurant", "Ruins view"],
             booking_url=None),
        dict(name="Kishkinda Heritage Resort", type=AccomType.hotel, price=4500,
             rating=4.3, review_count=320, address="Anegundi, Hampi",
             amenities=["Heritage property", "Free Wi-Fi", "Home-cooked food"],
             booking_url=None),
    ],
    "darjeeling": [
        dict(name="Windamere Hotel", type=AccomType.hotel, price=9500,
             rating=4.5, review_count=310, address="Observatory Hill, Darjeeling",
             amenities=["Colonial heritage", "Mountain view", "Restaurant", "Garden"],
             booking_url=None),
        dict(name="Mayfair Darjeeling", type=AccomType.hotel, price=14000,
             rating=4.7, review_count=420, address="The Mall, Darjeeling",
             amenities=["Heritage hotel", "Kanchenjunga view", "Restaurant", "Spa"],
             booking_url=None),
        dict(name="Andy's Guesthouse", type=AccomType.guesthouse, price=800,
             rating=4.4, review_count=560, address="HD Lama Road, Darjeeling",
             amenities=["Mountain view", "Home-cooked breakfast", "Free Wi-Fi"],
             booking_url=None),
    ],
    "kasol": [
        dict(name="Kiran Guest House", type=AccomType.guesthouse, price=700,
             rating=4.2, review_count=380, address="Main Kasol Village",
             amenities=["River view", "Basic rooms", "Cafe attached"],
             booking_url=None),
        dict(name="Parvati Camping", type=AccomType.camp, price=1000,
             rating=4.5, review_count=210, address="Kasol Riverbank",
             amenities=["Riverside", "Bonfire", "Meals included", "Tent accommodation"],
             booking_url=None),
        dict(name="The Hosteller Kasol", type=AccomType.hostel, price=600,
             rating=4.3, review_count=490, address="Main Kasol Market",
             amenities=["Dorm and private", "Free Wi-Fi", "Cafe", "River view"],
             booking_url=None),
    ],
}

# Generic fallback options for destinations not in the catalogue
_GENERIC_OPTIONS: list[dict] = [
    dict(name="Budget Traveller Hostel", type=AccomType.hostel, price=500,
         rating=3.9, review_count=120, address="Town Centre",
         amenities=["Free Wi-Fi", "Common area", "Lockers"],
         booking_url=None),
    dict(name="Heritage Guesthouse", type=AccomType.guesthouse, price=1200,
         rating=4.1, review_count=85, address="Old Town",
         amenities=["Home-cooked meals", "Free Wi-Fi", "Local tips"],
         booking_url=None),
    dict(name="Mid-Range City Hotel", type=AccomType.hotel, price=2800,
         rating=4.0, review_count=340, address="City Centre",
         amenities=["AC", "Restaurant", "Free Wi-Fi", "Parking"],
         booking_url=None),
    dict(name="Premium Business Hotel", type=AccomType.hotel, price=6500,
         rating=4.3, review_count=580, address="Commercial District",
         amenities=["Pool", "Restaurant", "Gym", "Free Wi-Fi", "Room service"],
         booking_url=None),
]


def _build_option(data: dict, destination: str) -> AccommodationOption:
    price = data["price"]
    if price < 1500:
        pr = PriceRange.budget
    elif price < 5000:
        pr = PriceRange.mid
    elif price < 15000:
        pr = PriceRange.premium
    else:
        pr = PriceRange.luxury

    return AccommodationOption(
        id=f"mock-{uuid.uuid4().hex[:8]}",
        name=data["name"],
        type=data["type"],
        provider="mock",
        address=f"{data['address']}, {destination}",
        price_per_night_inr=price,
        price_range=pr,
        rating=data.get("rating"),
        review_count=data.get("review_count", 0),
        amenities=data.get("amenities", []),
        booking_url=data.get("booking_url"),
    )


class MockAccommodationProvider(AccommodationProvider):
    """Always-available fallback. Zero external dependencies."""

    @property
    def name(self) -> str:
        return "mock"

    @property
    def is_available(self) -> bool:
        return True

    async def search(
        self, params: AccommodationSearchParams
    ) -> list[AccommodationOption]:
        key = params.city_name.lower().strip()
        raw = _CATALOGUE.get(key, _GENERIC_OPTIONS)

        options = [_build_option(d, params.city_name) for d in raw]

        # Budget filter
        if params.budget_per_night_max_inr:
            options = [
                o for o in options
                if o.price_per_night_inr is None
                or o.price_per_night_inr <= params.budget_per_night_max_inr
            ]

        # Type filter
        if params.preferred_types:
            typed = [o for o in options if o.type in params.preferred_types]
            options = typed if typed else options  # don't return empty if type missing

        return options
