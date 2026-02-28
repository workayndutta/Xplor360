# Xplor360 — Complete Project Guide
### Every file explained + Step-by-step setup for a complete beginner

---

## Table of Contents

1. [What Is Xplor360?](#1-what-is-xplor360)
2. [Project Map — What Every Folder Does](#2-project-map)
3. [How the App Works — Plain English](#3-how-the-app-works-plain-english)
4. [Every File Explained Line by Line](#4-every-file-explained)
5. [Setup Guide — Complete Beginner](#5-setup-guide-for-a-complete-beginner)
6. [Running the App](#6-running-the-app)
7. [Testing It Works](#7-testing-it-works)
8. [Environment Variables — What Each One Means](#8-environment-variables-explained)
9. [The Database — Every Table Explained](#9-database-tables-explained)
10. [Adding New APIs Later](#10-adding-new-apis-later)
11. [Common Errors and Fixes](#11-common-errors-and-fixes)
12. [Quick Reference Card](#12-quick-reference-card)

---

## 1. What Is Xplor360?

Xplor360 is a travel app built specifically for Indian travelers. It has three parts:

| Part | What it does |
|---|---|
| **SmartTrip** | You type where you want to go, the AI (Claude) plans your full day-by-day itinerary, suggests hotels, and eventually books trains/flights/buses |
| **ContentPilot** | You record yourself on your phone during the trip. The app turns your raw video into a polished blog post, Instagram Reel, and captions automatically |
| **SocialLaunch** | One button publishes your content to Instagram, YouTube, and Snapchat at the best time. Sends you a weekly performance report |

The app is built in three separate pieces:
- **Backend** — the brain/server (Python + FastAPI)
- **Web** — the website (Next.js, what you see in a browser)
- **Mobile** — the phone app (React Native / Expo)

---

## 2. Project Map

```
xplor360/
│
├── backend/                ← Python server (the brain)
│   ├── app/
│   │   ├── main.py         ← Server entry point — starts everything
│   │   ├── core/
│   │   │   └── config.py   ← All settings and API keys loaded here
│   │   ├── api/routes/
│   │   │   ├── health.py   ← Simple "is the server alive?" check
│   │   │   └── itinerary.py← The main endpoint — generates a trip plan
│   │   ├── agents/
│   │   │   └── itinerary_agent.py ← Talks to Claude AI, builds the trip
│   │   ├── models/
│   │   │   └── trip.py     ← Defines what a "trip" looks like (data shapes)
│   │   └── services/
│   │       ├── llm.py      ← Wrapper to talk to Claude AI
│   │       ├── supabase_client.py ← Wrapper to talk to the database
│   │       └── accommodation/
│   │           ├── base.py       ← Abstract definition of a hotel provider
│   │           ├── aggregator.py ← Tries providers: Amadeus → OTM → Mock
│   │           └── providers/
│   │               ├── amadeus.py      ← Real hotel prices (needs API key)
│   │               ├── opentripmap.py  ← Free hotel discovery (no prices)
│   │               └── mock.py         ← Fake but realistic hotel data (always works)
│   ├── requirements.txt    ← List of Python packages to install
│   ├── .env.example        ← Template for your secret API keys
│   └── Dockerfile          ← How to package the backend for deployment
│
├── web/                    ← Next.js website
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx    ← The homepage (localhost:3000)
│   │   │   ├── layout.tsx  ← Shared wrapper — SEO meta tags
│   │   │   ├── globals.css ← Global CSS styles
│   │   │   ├── auth/       ← Login and signup pages
│   │   │   └── dashboard/  ← Logged-in user's main area
│   │   ├── components/     ← Reusable UI pieces (buttons, cards, etc.)
│   │   ├── lib/
│   │   │   ├── api.ts      ← Functions to call the backend API
│   │   │   └── supabase.ts ← Function to connect to Supabase database
│   │   ├── hooks/          ← React hooks (shared logic)
│   │   └── types/          ← TypeScript type definitions
│   ├── package.json        ← List of JavaScript packages to install
│   ├── next.config.ts      ← Next.js configuration
│   ├── tailwind.config.ts  ← Design system / color configuration
│   └── .env.example        ← Template for web environment variables
│
├── mobile/                 ← Expo phone app
│   └── app/
│       └── (tabs)/
│           ├── index.tsx   ← Home tab
│           ├── trips.tsx   ← My trips tab
│           ├── record.tsx  ← ContentPilot recording tab
│           ├── publish.tsx ← SocialLaunch publishing tab
│           └── profile.tsx ← User profile tab
│
├── database/
│   ├── migrations/
│   │   └── 001_initial_schema.sql ← All database tables (run once in Supabase)
│   └── seed/
│       ├── destinations.sql       ← 30 Indian destinations pre-loaded
│       └── persona_archetypes.sql ← 20 traveler personality types
│
├── prompts/
│   ├── itinerary_builder.txt ← Instructions given to Claude AI for trip planning
│   ├── blog_writer.txt       ← Instructions for writing travel blogs
│   └── caption_generator.txt ← Instructions for generating Instagram captions
│
└── docker-compose.yml       ← Run everything with one command (advanced)
```

---

## 3. How the App Works (Plain English)

### When a user asks for a trip plan:

```
User fills form on website
         ↓
Web (Next.js) sends POST request to Backend API
         ↓
Backend receives it at POST /api/v1/itinerary/generate
         ↓
ItineraryAgent reads prompts/itinerary_builder.txt
(this tells Claude its rules and response format)
         ↓
ItineraryAgent builds a message and sends it to Claude AI
         ↓
Claude returns a full day-by-day plan as JSON (10-20 seconds)
         ↓
In parallel, AccommodationService searches for real hotels:
  → Tries Amadeus first  (real prices, needs API key, cities with airports only)
  → Falls back to OpenTripMap  (free, no prices, mountain/offbeat destinations)
  → Falls back to Mock  (always works, realistic fake data, final safety net)
         ↓
ItineraryAgent merges Claude's plan + hotel options together
         ↓
Backend sends the complete plan back to the website
         ↓
Website displays the itinerary to the user
```

### The accommodation "waterfall":

```
Is AMADEUS_CLIENT_ID set in .env?
  YES → Try Amadeus API
        Got results? → Use them and STOP ✓
        No results (city has no airport code)?
  NO  → Skip to next

Is OPENTRIPMAP_API_KEY set in .env?
  YES → Try OpenTripMap API
        Got results? → Use them and STOP ✓
        No results?
  NO  → Skip to next

Always: Use Mock data ✓ (never fails, always returns something)
```

---

## 4. Every File Explained

---

### `backend/app/main.py` — Server Entry Point

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog
from app.core.config import get_settings
from app.api.routes import health, itinerary
```
Imports everything needed. `FastAPI` is the web framework. `CORSMiddleware` allows the website to talk to the backend (browsers block cross-origin requests by default without this). `structlog` writes structured logs. `get_settings` loads all .env variables. `health` and `itinerary` are the two route files.

```python
app = FastAPI(
    title="Xplor360 API",
    docs_url="/docs" if not settings.is_production else None,
)
```
Creates the app. `docs_url="/docs"` means in development you can visit `localhost:8000/docs` and see an interactive testing UI. In production this is hidden for security.

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=(["*"] if not settings.is_production else ["https://xplor360.in"]),
)
```
CORS security. In development, any website can call the backend (`"*"`). In production, only `xplor360.in` is allowed.

```python
app.include_router(health.router)
app.include_router(itinerary.router, prefix="/api/v1")
```
Registers the two routes. All itinerary endpoints get the prefix `/api/v1` so they become `/api/v1/itinerary/generate`.

```python
@app.on_event("startup")
async def startup():
    log.info("xplor360_api_started", env=settings.app_env)
```
Writes a log line when the server boots. Useful for monitoring.

---

### `backend/app/core/config.py` — All Settings

```python
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
```
Tells pydantic to read the `.env` file. `extra="ignore"` means if `.env` has unknown variables, don't crash.

```python
    # Required — app won't start without these
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    anthropic_api_key: str

    # Optional — empty string means provider is disabled
    amadeus_client_id: str = ""
    opentripmap_api_key: str = ""
```
Variables with no default (`supabase_url: str`) are **required** — the app crashes on startup without them. Variables with `= ""` are **optional** — if missing, the feature just turns off gracefully.

```python
    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

@lru_cache
def get_settings() -> Settings:
    return Settings()
```
`is_production` checks if `APP_ENV=production` in `.env`. `@lru_cache` means the `.env` file is only read from disk once, then cached in memory (faster).

---

### `backend/app/api/routes/health.py` — Health Check

```python
@router.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat(), "service": "xplor360-api"}
```
The simplest possible endpoint. Anyone calls `GET /health` to confirm the server is alive. Used by monitoring tools, deployment pipelines, and you when debugging.

---

### `backend/app/api/routes/itinerary.py` — Trip Generation Endpoint

```python
@router.post("/generate", response_model=ItineraryResponse, status_code=201)
async def create_itinerary(req: ItineraryRequest):
```
- **`@router.post("/generate")`** — Full URL becomes `POST /api/v1/itinerary/generate`
- **`response_model=ItineraryResponse`** — FastAPI validates the response shape and auto-generates API docs
- **`status_code=201`** — Returns HTTP 201 (Created) on success
- **`req: ItineraryRequest`** — FastAPI auto-parses incoming JSON into this typed object

```python
    try:
        itinerary = await generate_itinerary(req)
        return itinerary
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"AI returned malformed JSON: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```
Error handling: 502 = Claude returned broken JSON (upstream service issue). 500 = anything else.

---

### `backend/app/models/trip.py` — Data Shapes

Defines what every piece of data looks like — like a contract for the whole app.

```python
class TripType(str, Enum):
    solo = "solo"
    couple = "couple"
    family = "family"
    group = "group"
    expedition = "expedition"
```
An Enum is a fixed list of allowed values. If you send `trip_type: "birthday"`, FastAPI rejects it immediately with a clear error. No need to add validation code yourself.

```python
class ItineraryRequest(BaseModel):
    destination: str = Field(..., examples=["Spiti Valley"])
    start_date: date
    end_date: date
    budget_inr: Optional[int] = Field(None, ge=1000)   # ge = greater than or equal to
    trip_type: TripType = TripType.solo                  # default value if not provided
    num_travelers: int = Field(1, ge=1, le=50)           # between 1 and 50
```
- `Field(...)` — the `...` means required (no default)
- `Field(None, ge=1000)` — optional, but if provided must be >= ₹1,000
- `= TripType.solo` — default value used if the field is not sent

```python
class ItineraryDay(BaseModel):
    accommodation_suggestions: list[AccommodationSuggestion]  # Claude's AI picks
    accommodation_options: list[AccommodationOption]           # Live API results
```
Each day has TWO accommodation fields:
- `accommodation_suggestions` — Claude recommends budget/mid/premium options from its training knowledge
- `accommodation_options` — Real results from Amadeus/OpenTripMap/Mock APIs

```python
class ItineraryResponse(BaseModel):
    itinerary_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    generated_at: datetime = Field(default_factory=datetime.utcnow)
```
`default_factory` auto-generates a unique ID and current timestamp. No need to pass these in the request.

---

### `backend/app/services/llm.py` — Claude AI Wrapper

```python
CLAUDE_PRIMARY = "claude-sonnet-4-6"      # Main reasoning tasks (smarter, costlier)
CLAUDE_FAST = "claude-haiku-4-5-20251001" # Short tasks: captions, summaries (faster, cheaper)
```

```python
async def complete(prompt, system="", model=CLAUDE_PRIMARY, temperature=0.7) -> str:
    response = client.messages.create(
        model=model,
        system=system,        # system prompt = Claude's "role" and rules
        messages=[{"role": "user", "content": prompt}],  # user's specific request
        temperature=temperature,  # 0 = deterministic, 1 = very creative
    )
    return response.content[0].text
```
`temperature=0.7` controls creativity. 0 is robotic/predictable, 1 is wild/creative. 0.7 is good for travel planning — creative but sensible.

```python
async def complete_json(prompt, system="", model=CLAUDE_PRIMARY) -> str:
    json_system = system + "\nYou must respond with valid JSON only. No markdown, no explanation."
    return await complete(prompt, system=json_system, temperature=0)  # temperature=0 for precision
```
For JSON output, temperature is set to 0 — we want exact structured output, not creativity.

---

### `backend/app/services/supabase_client.py` — Database Connection

```python
def get_supabase() -> Client:          # uses service_role_key — ADMIN access, bypasses RLS
def get_supabase_anon() -> Client:     # uses anon_key — USER access, respects RLS policies
```
**Always use `get_supabase_anon()` for user-facing reads.** Only use the admin client for backend-only operations that need to read/write any user's data.

---

### `backend/app/agents/itinerary_agent.py` — The Brain

The most important file. Orchestrates the whole trip generation pipeline.

```python
def _per_night_budget(req: ItineraryRequest) -> int | None:
    if not req.budget_inr:
        return None
    nights = max((req.end_date - req.start_date).days, 1)
    return int(req.budget_inr * 0.30 / nights)
```
Smart budget calculation. Total budget ₹30,000 for 5 nights → ₹1,800/night for accommodation (30% of budget is a standard travel allocation).

```python
def _preferred_accom_types(req):
    style_map = {
        "budget":     [AccomType.hostel, AccomType.guesthouse, AccomType.dharamshala],
        "luxury":     [AccomType.resort, AccomType.hotel, AccomType.villa],
        "adventure":  [AccomType.camp, AccomType.guesthouse, AccomType.hostel],
        "pilgrimage": [AccomType.dharamshala, AccomType.guesthouse, AccomType.hotel],
        "wildlife":   [AccomType.resort, AccomType.camp],
    }
    return style_map.get(req.travel_style.value, [])
```
Maps travel style → appropriate accommodation types. An adventure traveler gets camps and guesthouses filtered first. A luxury traveler gets resorts and villas.

```python
async def generate_itinerary(req: ItineraryRequest) -> ItineraryResponse:
    # Step 1: Ask Claude
    system_prompt = _load_prompt("itinerary_builder.txt")
    user_message = _build_user_message(req)
    raw = await complete_json(prompt=user_message, system=system_prompt, max_tokens=8192)

    # Step 2: Parse Claude's JSON into Python objects
    itinerary = _parse_llm_response(raw, req)

    # Step 3: Enrich with live hotel options
    itinerary = await _enrich_with_live_options(itinerary, req)

    return itinerary
```
The three-step pipeline. Steps 1+2 take 10-20 seconds (Claude thinking). Step 3 adds real hotel data.

```python
async def _enrich_with_live_options(itinerary, req):
    locations = _unique_overnight_locations(itinerary.days)  # e.g. ["Manali", "Kaza"]

    results_by_location = await service.search_multi(      # ALL locations searched in PARALLEL
        locations=locations,
        check_in=req.start_date,
        ...
    )

    for day in itinerary.days:
        if day.overnight_location in results_by_location:
            day.accommodation_options = [...]   # attach hotel results to each day
```
`search_multi` uses `asyncio.gather` — all hotel searches run simultaneously, not one-by-one. A 5-city itinerary searches all 5 cities at the same time.

---

### `backend/app/services/accommodation/base.py` — Hotel Provider Contract

```python
class PriceRange(str, Enum):
    budget = "budget"    # < ₹1,500/night
    mid = "mid"          # ₹1,500–5,000
    premium = "premium"  # ₹5,000–15,000
    luxury = "luxury"    # > ₹15,000
```
Indian market price tiers for 2025. These cut-offs are specific to the Indian travel market.

```python
class AccommodationProvider(ABC):
    @abstractmethod
    def is_available(self) -> bool: ...   # return False if API key is missing

    @abstractmethod
    async def search(self, params) -> list[AccommodationOption]: ...  # return [] on any error
```
Abstract Base Class — a template. Every provider MUST implement `is_available` and `search`. If you forget, Python throws an error immediately when the class is instantiated.

---

### `backend/app/services/accommodation/aggregator.py` — Provider Waterfall

```python
PROVIDER_PRIORITY = [
    AmadeusHotelProvider(),
    OpenTripMapProvider(),
    MockAccommodationProvider(),   # Always last — guaranteed fallback
]
```
The priority list. To add a new provider, just insert it into this list. No other file changes needed.

```python
async def search(self, params):
    for provider in self._providers:
        if not provider.is_available:
            continue                # skip — no API key configured
        try:
            results = await provider.search(params)
            if results:
                return results      # first non-empty result wins
        except Exception as e:
            log.warning(...)        # log and try next provider
    return []
```
The waterfall: try each provider in order, return first success. Errors are caught and logged — never crash the whole request because one hotel API failed.

---

### `backend/app/services/accommodation/providers/mock.py` — Always-On Fallback

```python
_CATALOGUE = {
    "manali": [
        dict(name="Zostel Manali", type=AccomType.hostel, price=600,
             rating=4.3, review_count=1840, address="Old Manali Road",
             amenities=["Free Wi-Fi", "Mountain view", "Bonfire"]),
        dict(name="Span Resort & Spa", type=AccomType.resort, price=8500, ...),
        ...
    ],
    "rishikesh": [...],
    "goa": [...],
    # ... 30 destinations total
}
```
Real hotels, manually curated, with realistic 2025 prices. Used in development and as the final fallback in production. Always on — no API key needed.

```python
class MockAccommodationProvider(AccommodationProvider):
    @property
    def is_available(self) -> bool:
        return True   # ALWAYS available
```

---

### `backend/app/services/accommodation/providers/amadeus.py` — Real Hotel Prices

```python
CITY_TO_IATA = {
    "delhi": "DEL",   "mumbai": "BOM",   "goa": "GOI",
    "ladakh": "IXL",  "varanasi": "VNS", "jaipur": "JAI",
    ...
}
```
Amadeus requires IATA airport codes. Manali, Rishikesh, Spiti Valley have no airports → no IATA code → Amadeus returns nothing → aggregator falls through to OpenTripMap/Mock.

```python
async def _get_token(self) -> str:
    if _token_cache.is_valid():
        return _token_cache.token    # reuse cached token (valid for 30 min)
    # ... fetch new token from Amadeus OAuth2 endpoint
```
Token caching avoids a new login request on every hotel search. The `-60` buffer refreshes 60 seconds before expiry for safety.

---

### `backend/app/services/accommodation/providers/opentripmap.py` — Free Discovery

```python
DESTINATION_COORDS = {
    "manali": (32.2396, 77.1887),
    "spiti valley": (32.2464, 78.0337),
    "kasol": (32.0100, 77.3200),
    "rishikesh": (30.0869, 78.2676),
    # ... 40+ destinations
}
```
OpenTripMap searches by GPS radius. This table maps destination names → lat/lng for 40+ popular Indian spots that Amadeus can't serve (no airport code).

Note: OpenTripMap returns hotel names and locations but **no pricing data**. It's useful for discovery — showing what exists at a destination — but not for price comparison.

---

### `web/src/app/page.tsx` — The Homepage

```tsx
<main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
```
Tailwind CSS classes. `bg-gradient-to-br from-orange-50 to-amber-50` creates a light orange diagonal gradient. No separate CSS file needed.

```tsx
<span className="text-brand-600">Xplor360</span>
```
`text-brand-600` is a custom color defined in `tailwind.config.ts` — the orange brand color (#f97316 range).

```tsx
{[
  { icon: "🗺️", title: "SmartTrip", desc: "AI itinerary builder..." },
  { icon: "🎬", title: "ContentPilot", desc: "Tap record..." },
  { icon: "📊", title: "SocialLaunch", desc: "One approval publishes..." },
].map((f) => (
  <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm">
    ...
  </div>
))}
```
Three feature cards rendered from an array. `key={f.title}` is required by React when rendering lists.

---

### `web/src/app/layout.tsx` — Shared Page Wrapper

```tsx
export const metadata: Metadata = {
  title: "Xplor360 — India's AI Travel & Content Platform",
  openGraph: { url: "https://xplor360.in", locale: "en_IN" },
};
```
SEO metadata. Controls what Google shows in search results and what WhatsApp shows when someone shares a link. `locale: "en_IN"` marks this as Indian English content.

---

### `web/src/lib/supabase.ts` — Browser Database Connection

```typescript
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```
`createBrowserClient` from `@supabase/ssr` handles session cookies correctly in Next.js App Router. The `!` tells TypeScript "trust me, these are not null".

---

### `web/src/lib/api.ts` — Backend API Calls

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function generateItinerary(payload: ItineraryRequest): Promise<ItineraryResponse> {
  const res = await fetch(`${API_URL}/api/v1/itinerary/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail ?? "Failed to generate itinerary");
  }
  return res.json();
}
```
The main function components call to generate a trip plan. `?? "http://localhost:8000"` means: use the env variable if set, else default to localhost. Error handling parses the backend's error message and throws it.

---

### `prompts/itinerary_builder.txt` — Claude's Instructions

This is the **system prompt** — tells Claude who it is and what rules to follow.

Key sections:

**Identity given to Claude:**
> "You are Xplor360's ItineraryAgent — an expert Indian travel planner with deep knowledge of all Indian states, Indian transport options (IRCTC classes, state RTCs, domestic flights), accommodation across all price ranges..."

**Rules Claude must follow:**
1. Use real place names, real train numbers (e.g. `12905 Howrah Superfast`)
2. Use Indian terms naturally — darshan, thali, chai, ghats — don't Westernise
3. Every activity must have a `content_opportunity` — what to record for the travel video
4. Warn about altitude acclimatisation on Day 1 for Ladakh/Spiti
5. Tailor packing list to destination and season — not a generic list
6. Don't over-schedule — mountain days have fewer activities

**Response format:** Exact JSON structure Claude must return. If Claude deviates, `_parse_llm_response()` in the agent will fail.

---

### `database/migrations/001_initial_schema.sql` — All Tables

```sql
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  display_name    text,
  subscription    text not null default 'free',
  ...
);
```
`references auth.users(id) on delete cascade` — when a user deletes their Supabase auth account, their profile is automatically deleted too (cascade).

```sql
create policy "users can only see own trips"
  on public.trips for select
  using (auth.uid() = user_id);
```
**Row Level Security (RLS)** — the database itself enforces privacy. Even direct database access can't read another user's trips. `auth.uid()` is the logged-in user's ID provided by Supabase automatically.

```sql
create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();
```
**Trigger** — automatically updates the `updated_at` column whenever a row changes. No need to do this in application code.

---

### `database/seed/destinations.sql` — 30 Starter Destinations

```sql
('Ladakh', 'Jammu & Kashmir', 34.1526, 77.5771,
 'High-altitude desert plateau...',
 ARRAY['adventure','bike','photography','altitude'],
 ARRAY[6,7,8,9],      -- best in June-September (months 6,7,8,9)
 3000, 8000,          -- ₹3,000–8,000 per person per day
 'hard', true,        -- difficulty: hard, permits required: yes
 'Inner Line Permit (ILP) required...')
```

### `database/seed/persona_archetypes.sql` — 20 Traveler Types

Pre-built traveler personalities:
- **Budget Backpacker** — ₹800/day, hostels, Kasol/Manali/Rishikesh
- **Luxury Curated** — ₹20,000/day, private experiences, Udaipur/Goa
- **Himalayan Trekker** — ₹4,000/day, high altitude, Kedarkantha/Ladakh
- **Char Dham Devotee** — ₹3,000/day, sacred pilgrimage circuit
- **Digital Nomad** — ₹4,000/day, 2-4 week stays, good WiFi required
- **Solo Female Traveler** — ₹5,000/day, safety-conscious, inspiration-focused
- And 14 more...

---

## 5. Setup Guide for a Complete Beginner

> You need a computer running Windows, Mac, or Linux.

---

### Step 1: Check Prerequisites

Open your terminal (Command Prompt / PowerShell on Windows, Terminal on Mac/Linux):

```bash
node --version      # Need v18 or higher
python3 --version   # Need 3.10 or higher
npm --version       # Comes with Node
pip3 --version      # Comes with Python
```

**If Node.js is missing:** Go to [nodejs.org](https://nodejs.org) → click "LTS" → install.

**If Python is missing:** Go to [python.org/downloads](https://python.org/downloads) → download the latest version.

---

### Step 2: Create Your Supabase Database (Free)

**2a. Create a free account**
1. Go to [supabase.com](https://supabase.com) → Sign up (GitHub or email)
2. Click **New project**
3. Name: `xplor360` | Region: **South Asia (Mumbai)** | Set a password
4. Click **Create new project**
5. Wait 2-3 minutes for setup

**2b. Get your API keys**
1. In your Supabase dashboard → ⚙️ **Settings** → **API**
2. Copy these three values and save them somewhere:
   - **Project URL** → e.g. `https://abcdefghij.supabase.co`
   - **anon public key** → long string starting with `eyJ`
   - **service_role secret key** → another long string starting with `eyJ` (**keep this private**)

**2c. Create the database tables**
1. In Supabase → click **SQL Editor** (left sidebar, `</>` icon)
2. Click **+ New query**
3. Open file `database/migrations/001_initial_schema.sql` on your computer, copy ALL contents
4. Paste into the SQL editor → click green **Run** button
5. You should see: `Success. No rows returned.`

**2d. Add starter data**
- New query → paste `database/seed/persona_archetypes.sql` → Run
- New query → paste `database/seed/destinations.sql` → Run

---

### Step 3: Get a Claude AI API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Click **API Keys** in the left menu → **Create Key**
4. Copy the key — it starts with `sk-ant-`
5. Add a payment method and some credits (each itinerary costs about ₹0.50–₹2)

---

### Step 4: Set Up the Backend

**4a. Navigate to the backend folder**
```bash
cd xplor360/backend
```

**4b. Copy the environment template**
```bash
# Mac/Linux:
cp .env.example .env

# Windows:
copy .env.example .env
```

**4c. Edit the .env file**

Open `.env` in any text editor and fill in YOUR values:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
ANTHROPIC_API_KEY=sk-ant-...
```
Leave everything else blank for now.

**4d. Create a Python virtual environment**
```bash
# Mac/Linux:
python3 -m venv .venv
source .venv/bin/activate

# Windows:
python -m venv .venv
.venv\Scripts\activate
```
After activating, you'll see `(.venv)` at the start of your terminal prompt.

**4e. Install Python packages**
```bash
pip install -r requirements.txt
```
This takes 2-5 minutes.

**4f. Start the backend server**
```bash
uvicorn app.main:app --reload --port 8000
```
You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```
**Leave this terminal open.** The server runs here.

---

### Step 5: Set Up the Frontend Website

**Open a NEW terminal window** (leave backend running).

```bash
cd xplor360/web

# Copy the env template:
# Mac/Linux:
cp .env.example .env.local
# Windows:
copy .env.example .env.local
```

Edit `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm install          # install dependencies (1-3 minutes)
npm run dev          # start the website
```

You should see:
```
▲ Next.js 15.1.3
- Local: http://localhost:3000
```

---

### Step 6: (Optional) Mobile App

You need **Expo Go** installed on your phone (free on App Store / Play Store).

```bash
cd xplor360/mobile
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone. Or press `w` to open in browser.

---

## 6. Running the App

Every time you want to run Xplor360, you need **two terminal windows open**:

**Terminal 1 — Backend:**
```bash
cd xplor360/backend
source .venv/bin/activate      # Mac/Linux (skip on Windows: use .venv\Scripts\activate)
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd xplor360/web
npm run dev
```

Then open your browser: **http://localhost:3000**

---

## 7. Testing It Works

### Test 1: Is the backend alive?
Browser → `http://localhost:8000/health`

Expected:
```json
{"status": "ok", "timestamp": "2025-10-01T12:00:00", "service": "xplor360-api"}
```

### Test 2: See all API endpoints
Browser → `http://localhost:8000/docs`

You'll see an interactive testing page for all APIs (automatically generated from the code).

### Test 3: Generate a trip plan
In the `/docs` page:
1. Click **POST /api/v1/itinerary/generate**
2. Click **Try it out**
3. Replace the example with:
```json
{
  "destination": "Manali",
  "origin": "Delhi",
  "start_date": "2025-10-01",
  "end_date": "2025-10-05",
  "trip_type": "solo",
  "travel_style": "adventure",
  "num_travelers": 1
}
```
4. Click **Execute**
5. Wait 10-20 seconds (Claude is thinking)
6. You get a full 5-day itinerary with accommodation options

### Test 4: Is the website working?
Browser → `http://localhost:3000`

You should see the Xplor360 homepage with orange branding and three feature cards.

---

## 8. Environment Variables Explained

### Backend `.env`

| Variable | What it does | Required? | Where to get it |
|---|---|---|---|
| `APP_ENV` | `development` or `production` — controls CORS, logging, API docs | No | Type it yourself |
| `APP_SECRET_KEY` | Encrypts session tokens. Change to random string in production | No for dev | Any random string |
| `SUPABASE_URL` | Your database address | **YES** | Supabase → Settings → API |
| `SUPABASE_ANON_KEY` | Public key for user-facing DB reads | **YES** | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key — never expose in frontend code | **YES** | Supabase → Settings → API |
| `ANTHROPIC_API_KEY` | Pays for Claude AI calls | **YES** | console.anthropic.com |
| `OPENAI_API_KEY` | For Whisper audio transcription (Phase 2) | No | platform.openai.com |
| `AMADEUS_CLIENT_ID` | Real hotel prices for cities with airports | No | developers.amadeus.com |
| `AMADEUS_CLIENT_SECRET` | Goes with the above | No | developers.amadeus.com |
| `AMADEUS_BASE_URL` | `https://test.api.amadeus.com` for testing | No | Type it yourself |
| `OPENTRIPMAP_API_KEY` | Free hotel discovery for mountain destinations | No | opentripmap.io/register |
| `RAILYATRI_API_KEY` | Train ticket search and booking | No (Phase 1) | Contact Railyatri |
| `REDBUS_API_KEY` | Bus ticket booking | No (Phase 1) | Contact Redbus |
| `INSTAGRAM_APP_ID` | Post to Instagram | No (Phase 2) | Meta Developer Console |
| `YOUTUBE_API_KEY` | Upload to YouTube | No (Phase 2) | Google Cloud Console |
| `REDIS_URL` | Background job queue | No | Redis Cloud or local Redis |
| `RAZORPAY_KEY_ID` | Accept payments | No (Phase 1) | razorpay.com |
| `GOOGLE_MAPS_API_KEY` | Maps on the website | No | Google Cloud Console |
| `OPENWEATHER_API_KEY` | Weather forecasts | No | openweathermap.org |

### Web `.env.local`

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Same URL as backend |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key only — never service_role in frontend |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` in dev, `https://api.xplor360.in` in production |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Shows maps (optional) |

> **For Day 1, you only need:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `ANTHROPIC_API_KEY`.

---

## 9. Database Tables Explained

### Users group

| Table | What it stores |
|---|---|
| `profiles` | User's name, avatar, subscription (free/creator/pro) |
| `persona_profiles` | 7-dimension traveler DNA: fitness level, budget range, content style, travel frequency, etc. |
| `persona_archetypes` | 20 pre-built traveler types (Budget Backpacker, Himalayan Trekker, etc.) |

### Destinations group

| Table | What it stores |
|---|---|
| `destinations` | 30 Indian destinations with GPS, tags, best months, budget ranges, permit info |
| `shot_guides` | Specific filming spots with ContentPilot tips: framing, best time, shot type |

### Trips group

| Table | What it stores |
|---|---|
| `trips` | A user's trip record: destination, dates, status (planning → booked → active → completed) |
| `itineraries` | AI-generated day-by-day plan linked to a trip. Stores raw Claude JSON for debugging |
| `itinerary_days` | Each day: title, transport, accommodation, estimated cost |
| `itinerary_activities` | Each activity per day: time, GPS, cost, ContentPilot tip |
| `trip_legs` | Actual bookings: flight PNR, train ticket number, hotel confirmation |
| `fare_alerts` | "Notify me when Delhi→Goa drops below ₹3,000" |

### Expeditions group

| Table | What it stores |
|---|---|
| `expeditions` | Ladakh ride, Char Dham yatra, Himalayan trek organized by a leader |
| `expedition_participants` | Who signed up and their payment status |

### Media & Content group

| Table | What it stores |
|---|---|
| `media_assets` | Recorded videos/audio with transcripts and AI quality scores |
| `content_drafts` | AI-generated blog posts, Reel scripts, captions. Tracks if user approved/edited |

### Social Publishing group

| Table | What it stores |
|---|---|
| `social_accounts` | Connected Instagram/YouTube accounts with encrypted OAuth tokens |
| `published_posts` | Every post: platform, type (Reel/Story/Post), status, scheduled time |
| `post_analytics` | Likes, views, reach, comments, shares per post (updated daily) |
| `nudge_log` | NudgeAgent: "You haven't posted in 3 days" reminders |

---

## 10. Adding New APIs Later

### Add a new accommodation provider

1. Create `backend/app/services/accommodation/providers/mymmt.py`
2. Implement the three required methods:

```python
from app.services.accommodation.base import AccommodationProvider, AccommodationSearchParams, AccommodationOption

class MakeMyTripProvider(AccommodationProvider):

    @property
    def name(self) -> str:
        return "makemytrip"

    @property
    def is_available(self) -> bool:
        return bool(get_settings().makemytrip_api_key)  # add this key to config.py too

    async def search(self, params: AccommodationSearchParams) -> list[AccommodationOption]:
        # Your API call here
        # Return [] on any error (never raise to the aggregator)
        pass
```

3. Add it to `aggregator.py`:

```python
from app.services.accommodation.providers.mymmt import MakeMyTripProvider

PROVIDER_PRIORITY = [
    AmadeusHotelProvider(),
    MakeMyTripProvider(),      # Add here
    OpenTripMapProvider(),
    MockAccommodationProvider(),
]
```

4. Add the key to `core/config.py` and `.env.example`:

```python
makemytrip_api_key: str = ""
```

**Nothing else needs to change.** The aggregator picks it up automatically.

---

### Add a new API route

1. Create `backend/app/api/routes/bookings.py`
2. Define routes
3. Register in `main.py`:

```python
from app.api.routes import bookings
app.include_router(bookings.router, prefix="/api/v1")
```

---

## 11. Common Errors and Fixes

### "supabase_url field required" or "validation error"
**Cause:** `.env` file is missing, empty, or not in the right folder.
**Fix:** Make sure you're in `xplor360/backend/` when you run the server, and that `.env` exists there with all required values.

### "Invalid API key" or 401 from Anthropic
**Cause:** `ANTHROPIC_API_KEY` is wrong, expired, or your account has no credits.
**Fix:** Go to `console.anthropic.com` → API Keys → create a fresh key. Check that your account has credits.

### "Address already in use" / Port 8000 busy
```bash
# Find what's using port 8000:
lsof -i :8000      # Mac/Linux
netstat -ano | findstr :8000   # Windows

# Or just use a different port:
uvicorn app.main:app --reload --port 8001
# Then update web/.env.local: NEXT_PUBLIC_API_URL=http://localhost:8001
```

### "ModuleNotFoundError: No module named 'fastapi'"
**Cause:** Virtual environment not activated.
**Fix:**
```bash
source .venv/bin/activate    # Mac/Linux
.venv\Scripts\activate       # Windows
```

### "npm run dev" fails — "next: not found"
**Cause:** JavaScript dependencies not installed.
**Fix:** `cd web && npm install`

### The `(.venv)` prefix disappears in a new terminal
**Cause:** Virtual environment only lasts for the current terminal session.
**Fix:** Run `source .venv/bin/activate` again every time you open a new terminal for the backend.

### AI returns "502 Bad Gateway" / malformed JSON
**Cause:** Claude returned text with markdown code fences or explanation text (rare).
**Status:** The `complete_json()` function already strips these. If it persists, check your `ANTHROPIC_API_KEY` and account credits.

### Supabase "JWT expired" errors
**Cause:** The anon key or service role key you copied has expired (very rare) or was copied incorrectly.
**Fix:** Go back to Supabase → Settings → API → copy the keys again carefully.

### Website shows "Network Error" when generating itinerary
**Cause:** Backend is not running, or `NEXT_PUBLIC_API_URL` is wrong.
**Fix:**
1. Check that the backend terminal is still running (shows `Uvicorn running on...`)
2. Check `web/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. Restart `npm run dev` after changing `.env.local`

---

## 12. Quick Reference Card

| Command | What it does |
|---|---|
| `source .venv/bin/activate` | Activate Python environment (Mac/Linux) |
| `.venv\Scripts\activate` | Activate Python environment (Windows) |
| `pip install -r requirements.txt` | Install/update Python packages |
| `uvicorn app.main:app --reload --port 8000` | Start backend server |
| `npm install` | Install/update JavaScript packages |
| `npm run dev` | Start web development server |
| `npx expo start` | Start mobile app |
| `http://localhost:8000/health` | Check backend is alive |
| `http://localhost:8000/docs` | Interactive API documentation + testing |
| `http://localhost:3000` | The website |

---

*Document version: 1.0 | Project version: 0.1.0 | February 2026*
