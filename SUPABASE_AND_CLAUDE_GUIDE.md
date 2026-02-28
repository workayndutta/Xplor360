# Xplor360 — Supabase Setup & How Claude Works
### A complete layman's guide — no technical experience needed

---

## Table of Contents

**Part A — Supabase Setup**
1. [What is Supabase? (Plain English)](#1-what-is-supabase-plain-english)
2. [Create Your Supabase Account and Project](#2-create-your-supabase-account-and-project)
3. [Copy Your Three API Keys](#3-copy-your-three-api-keys)
4. [Enable Email Login](#4-enable-email-login)
5. [Create All Database Tables](#5-create-all-database-tables)
6. [Load the Starter Data](#6-load-the-starter-data)
7. [Connect the Backend to Supabase](#7-connect-the-backend-to-supabase)
8. [Connect the Website to Supabase](#8-connect-the-website-to-supabase)
9. [Verify Everything Works](#9-verify-everything-works)
10. [What the Database Looks Like (All Tables Explained)](#10-what-the-database-looks-like)

**Part B — How Claude AI Works in Xplor360**
11. [What is Claude? (Plain English)](#11-what-is-claude-plain-english)
12. [The Full Journey of a Trip Request](#12-the-full-journey-of-a-trip-request)
13. [The Prompt File — How You Talk to Claude](#13-the-prompt-file--how-you-talk-to-claude)
14. [What Claude Returns — Annotated Example](#14-what-claude-returns--annotated-example)
15. [Temperature — Creativity Dial](#15-temperature--creativity-dial)
16. [Why Two Claude Models?](#16-why-two-claude-models)
17. [Cost — How Much Does Each Request Cost?](#17-cost--how-much-does-each-request-cost)
18. [How to Change What Claude Does](#18-how-to-change-what-claude-does)
19. [The Hotel Search That Runs Alongside Claude](#19-the-hotel-search-that-runs-alongside-claude)
20. [Common AI Questions Answered](#20-common-ai-questions-answered)

---

# PART A — SUPABASE SETUP

---

## 1. What is Supabase? (Plain English)

Think of Supabase as **a ready-made database + login system that lives on the internet for free.**

Without Supabase, you would need to:
- Buy a server
- Install PostgreSQL (database software)
- Write login/signup code from scratch
- Write security rules from scratch
- Manage backups yourself

With Supabase, all of that is already done. You just:
1. Create a free account
2. Get three passwords (API keys)
3. Paste those into the `.env` file

That's it. Your app instantly has:
- A full database (like Excel, but for an app)
- User login/signup (email + password)
- Security rules (each user only sees their own data)
- A real-time dashboard to inspect data

---

### The Three Keys You Need

| Key | What it does | Who uses it | Safety level |
|---|---|---|---|
| **Project URL** | The address of your database | Both backend and website | Public — OK to share |
| **anon key** | Lets logged-in users read their own data | Website (in the browser) | Public — OK in frontend code |
| **service_role key** | Full admin access — can read/write ALL data | Backend server ONLY | **SECRET — never put in website code** |

---

## 2. Create Your Supabase Account and Project

### Step 1 — Go to Supabase

Open your browser and go to: `https://supabase.com`

Click the green **"Start your project"** button (top right).

---

### Step 2 — Sign Up

You can sign up with:
- Your **GitHub** account (recommended — one click)
- Your **email + password**

---

### Step 3 — Create a New Project

After signing in, you'll land on the dashboard. Click **"New project"**.

Fill in:

| Field | What to enter |
|---|---|
| **Organization** | Your name or "Personal" (auto-created) |
| **Name** | `xplor360` |
| **Database Password** | A strong password — **save this somewhere safe** |
| **Region** | `Southeast Asia (Singapore)` or `South Asia (Mumbai)` — pick closer to India |
| **Pricing Plan** | Free (default) |

Click **"Create new project"**.

You'll see a loading screen — **wait 2-3 minutes** while Supabase sets up the database.

---

### Step 4 — Wait for the Green Check

You'll see a progress bar. When all checks turn green, your project is ready.

---

## 3. Copy Your Three API Keys

This is the most important step. These three values go into your `.env` files.

### Where to find them:

1. In your Supabase project dashboard, look at the **left sidebar**
2. Click the **gear icon** (⚙️) at the very bottom — this is "Project Settings"
3. In the settings menu, click **"API"**

You'll see a page like this:

```
Project URL
https://abcdefghijklmnop.supabase.co        ← COPY THIS

Project API Keys

anon   public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...    ← COPY THIS

service_role   secret
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...    ← COPY THIS (keep private)
```

**Copy all three and save them in a text file on your computer** — you'll need them in the next steps.

> **Important:** The `service_role` key is a master key. Anyone who has it can read and delete ALL user data. Never paste it into website code. Only use it in the backend.

---

## 4. Enable Email Login

By default, email login may require email verification. For development, let's turn that off so you can test without clicking confirmation emails.

1. In Supabase dashboard → left sidebar → **Authentication** (person icon)
2. Click **"Providers"**
3. Click **"Email"**
4. Turn **OFF** "Confirm email" toggle
5. Click **Save**

Later when you go to production, turn this back on.

---

## 5. Create All Database Tables

This is where you set up the full database structure for Xplor360.

### Step 1 — Open the SQL Editor

In the left sidebar, click **"SQL Editor"** (looks like `</>` brackets).

Click **"+ New query"** at the top.

---

### Step 2 — Run the Main Schema

You'll see an empty text box. This is where you run SQL commands.

1. Open the file `xplor360/database/migrations/001_initial_schema.sql` on your computer
2. Press **Ctrl+A** (Windows/Linux) or **Cmd+A** (Mac) to select all
3. Press **Ctrl+C** to copy
4. Click inside the Supabase SQL editor text box
5. Press **Ctrl+V** to paste
6. Click the green **"Run"** button (or press Ctrl+Enter)

Wait 5-10 seconds.

**Expected result:** You'll see a message at the bottom:
```
Success. No rows returned.
```

If you see an error — check the error message. The most common issue is running it twice. If tables already exist, Supabase will say "relation already exists." That's fine — it means the tables are already created.

---

### What just happened?

That SQL file created **19 tables** in your database. Think of each table as a spreadsheet tab:

```
Your Supabase Database
│
├── profiles              (one row per user — name, subscription, language)
├── persona_profiles      (user's travel personality — 7 dimensions)
├── persona_archetypes    (20 traveler type templates)
│
├── destinations          (30 Indian destinations with GPS + permit info)
├── shot_guides           (ContentPilot filming tips per destination)
│
├── trips                 (each user's trip plan)
├── itineraries           (AI-generated day-by-day plans)
├── itinerary_days        (individual days within a plan)
├── itinerary_activities  (individual activities per day)
├── trip_legs             (actual bookings: flights, trains, hotels)
├── fare_alerts           (price drop notifications)
│
├── expeditions           (Ladakh rides, treks, Char Dham — group trips)
├── expedition_participants
│
├── media_assets          (recorded videos/audio uploaded from phone)
├── content_drafts        (AI-generated blogs, captions, Reel scripts)
│
├── social_accounts       (connected Instagram/YouTube accounts)
├── published_posts       (every published post)
├── post_analytics        (likes, views, reach per post)
└── nudge_log             (AI reminders: "you haven't posted in 3 days")
```

---

### Understanding Row Level Security (RLS)

The schema also set up security rules called **Row Level Security (RLS)**. Here's what it means in plain English:

Without RLS:
```
User A logs in → can accidentally see User B's trips
```

With RLS (what we set up):
```
User A logs in → database automatically filters → only sees User A's trips
Even if User A tries to request another user's data — the database blocks it
```

The rule in the SQL file looks like this:
```sql
create policy "users_own_rows" on public.trips
  using (user_id = auth.uid());
```

This says: "When reading from the trips table, only return rows where `user_id` matches the logged-in user's ID."

This security runs inside the database itself — not in our Python code. It can never be bypassed accidentally.

---

## 6. Load the Starter Data

The database tables are empty. Let's add some starter content.

### Seed File 1 — 20 Traveler Personality Types

1. In SQL Editor → click **"+ New query"**
2. Open `xplor360/database/seed/persona_archetypes.sql` on your computer
3. Copy all contents → paste in SQL editor → click **Run**

**Expected result:** `Success. 20 rows inserted.`

This added 20 traveler archetypes like:
- Memory Maker — Budget Backpacker
- Expedition Seeker — Himalayan Trekker
- Pilgrim — Char Dham Devotee
- Globe Trotter — Solo Female Traveler
- Family Orchestrator — Multi-Gen Planner
- (and 15 more...)

---

### Seed File 2 — 30 Indian Destinations

1. New query → open `xplor360/database/seed/destinations.sql` → paste → Run

**Expected result:** `Success. 30 rows inserted.`

This added destinations like Ladakh, Manali, Spiti Valley, Goa, Kerala, Rishikesh — each with GPS coordinates, best travel months, budget ranges, difficulty, and permit requirements.

---

### Verify the data is there

1. In the left sidebar, click **"Table Editor"** (grid icon)
2. Click on `persona_archetypes`
3. You should see 20 rows of traveler types
4. Click on `destinations`
5. You should see 30 rows of Indian destinations

---

## 7. Connect the Backend to Supabase

Now we tell the Python backend where to find the database.

### Step 1 — Create the `.env` file

Open a terminal and navigate to the backend folder:

```bash
cd xplor360/backend
```

Copy the template:
```bash
cp .env.example .env      # Mac/Linux
copy .env.example .env    # Windows
```

### Step 2 — Fill in the values

Open `xplor360/backend/.env` in any text editor (Notepad, VS Code, TextEdit).

Find these three lines and replace with YOUR values from Step 3:

```
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Also fill in your Claude AI key (you'll set this up separately — see Part B):
```
ANTHROPIC_API_KEY=sk-ant-...
```

Leave everything else blank or as-is for now.

**Save the file.**

---

### How the backend uses these keys

In `backend/app/services/supabase_client.py`:

```python
def get_supabase():
    # Uses service_role_key — ADMIN. Can read/write any row.
    # ONLY called from backend code, never from the browser.
    return create_client(settings.supabase_url, settings.supabase_service_role_key)

def get_supabase_anon():
    # Uses anon_key — respects Row Level Security.
    # Used for reading data on behalf of a logged-in user.
    return create_client(settings.supabase_url, settings.supabase_anon_key)
```

The backend uses the **admin key** internally to save generated itineraries to the database. It uses the **anon key** when fetching a user's own trips.

---

## 8. Connect the Website to Supabase

### Step 1 — Create the website `.env` file

```bash
cd xplor360/web
cp .env.example .env.local      # Mac/Linux
copy .env.example .env.local    # Windows
```

### Step 2 — Fill in the values

Open `xplor360/web/.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Notice:** The website only gets the **anon key** — never the `service_role` key.

The `NEXT_PUBLIC_` prefix means Next.js will include this variable in the browser-side JavaScript. Never put the service_role key in a `NEXT_PUBLIC_` variable — it would be visible to anyone who opens browser DevTools.

### How the website uses Supabase

In `web/src/lib/supabase.ts`:

```typescript
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

This creates a Supabase connection that handles:
- Login / signup forms
- Reading the logged-in user's trips on the dashboard
- Storing session cookies (so users stay logged in on page refresh)

---

## 9. Verify Everything Works

### Test 1 — Database is connected to the backend

Start the backend:
```bash
cd xplor360/backend
source .venv/bin/activate    # if not already activated
uvicorn app.main:app --reload --port 8000
```

If Supabase is connected correctly, you'll see:
```
INFO:     xplor360_api_started env=development
INFO:     Uvicorn running on http://127.0.0.1:8000
```

If there's a Supabase error, you'll see something like:
```
ValidationError: supabase_url: field required
```
→ This means the `.env` file has empty or missing values.

---

### Test 2 — Inspect the data in the dashboard

1. Go to Supabase dashboard → **Table Editor**
2. Click on `destinations`
3. You should see 30 rows with Indian destinations
4. Click on `persona_archetypes`
5. You should see 20 traveler types

---

### Test 3 — Try signing up a user

1. Start the website: `cd web && npm run dev`
2. Open `http://localhost:3000`
3. Navigate to the sign-up page
4. Create a test account (use any email — remember you turned off email confirmation)
5. Go to Supabase dashboard → **Authentication** → **Users**
6. You should see your new user listed there

---

### Test 4 — Check RLS is working

After signing up, go to **Table Editor** → `trips`.

It will show 0 rows (empty) — that's correct. The admin panel bypasses RLS, so you'll see 0 rows because no trips have been created yet. But a logged-in user on the website would also see 0 rows because they have no trips yet. Both are correct.

---

## 10. What the Database Looks Like

Here is every table explained with a concrete example row.

---

### `profiles` — One row per user

```
id           display_name   subscription   preferred_lang
──────────   ────────────   ────────────   ──────────────
uuid-abc...  Arjun Kumar    free           hi
uuid-def...  Priya Sharma   pro            en
```

When a user signs up through Supabase Auth, a row is created in `auth.users` (managed by Supabase). Our `profiles` table is linked to it (`references auth.users`), so we can store extra info like display name and subscription tier.

---

### `trips` — One row per trip a user creates

```
id           user_id      title                   destination    start_date   status
──────────   ──────────   ─────────────────────   ──────────     ──────────   ────────
uuid-111...  uuid-abc...  "Spiti Adventure"       Spiti Valley   2025-06-10   planning
uuid-222...  uuid-abc...  "Goa Long Weekend"      Goa            2025-11-15   completed
```

---

### `itineraries` — The AI-generated plan for a trip

```
id           trip_id      summary                              total_estimated_cost_inr
──────────   ──────────   ──────────────────────────────────   ────────────────────────
uuid-333...  uuid-111...  "A raw Himalayan journey across..."  28000
```

The full JSON from Claude (day-by-day breakdown) is also stored in `raw_llm_response` — so if there's a bug, you can look at exactly what Claude said.

---

### `itinerary_days` — One row per day in the plan

```
itinerary_id   day_number   title                              overnight_location
──────────     ──────────   ────────────────────────────────   ──────────────────
uuid-333...    1            "Delhi to Shimla — Begin"          Shimla
uuid-333...    2            "Shimla to Kaza — The Ascent"      Kaza
uuid-333...    3            "Kaza — The Heart of Spiti"        Kaza
```

---

### `itinerary_activities` — Individual activities within a day

```
day_id       time    title                    cost_inr   content_opportunity
──────────   ─────   ──────────────────────   ────────   ──────────────────────────────────────
uuid-day2    09:00   Key Monastery Visit      0          "Film the whitewashed walls at golden hour"
uuid-day2    13:00   Spiti River Picnic       150        "Record the turquoise water, narrate feelings"
uuid-day2    16:30   Hikkim Post Office       0          "Content gold — world's highest post office"
```

---

### `content_drafts` — AI-generated content for social media

```
draft_type           title                  content (truncated)       user_approved
────────────────     ─────────────────────  ────────────────────      ─────────────
blog                 "3 Days in Spiti"      "The road to Spiti is..." false
caption_instagram    null                   "#SpitValley This is..."  true
reel_script          null                   "Open on: you standing..." false
```

---

### `social_accounts` — Connected social platforms

```
user_id      platform     platform_username   connected_at
──────────   ──────────   ─────────────────   ────────────
uuid-abc...  instagram    @arjun.travels      2025-09-01
uuid-abc...  youtube      Arjun Travels       2025-09-01
```

The `access_token` column stores the OAuth token that allows posting to Instagram/YouTube. This must be encrypted at rest in production using Supabase Vault.

---

# PART B — HOW CLAUDE WORKS IN XPLOR360

---

## 11. What is Claude? (Plain English)

Claude is an AI made by Anthropic (similar to ChatGPT, but made by a different company).

Think of Claude as a **very knowledgeable assistant** that:
- You can give written instructions to ("You are a travel planner. Follow these rules...")
- You can ask questions ("Plan a 5-day trip to Manali for 2 people")
- It responds in text — or, in this case, in structured JSON data

In Xplor360, Claude is used to **generate full trip itineraries** based on what the user fills in. Instead of having humans write trip plans, Claude does it in ~15 seconds.

---

### Claude vs "the database"

People sometimes confuse what Claude does vs what the database does. Here's the clear split:

| What Claude does | What Supabase/database does |
|---|---|
| **Thinks and creates** | **Stores and retrieves** |
| Generates a brand-new trip plan based on the user's input | Saves that plan so the user can come back to it later |
| Suggests hotels based on knowledge from training | Looks up real-time hotel prices from APIs |
| Creates blog posts from voice recordings | Stores the final approved blog post |
| Costs money per request (API call) | Stores data (mostly free on Supabase free tier) |
| Lives at api.anthropic.com (external) | Lives in your Supabase project (your database) |

---

## 12. The Full Journey of a Trip Request

Let's trace exactly what happens when a user fills in the trip form and clicks "Generate Itinerary".

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1 — User fills the form (0 seconds)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User types on the website:
  Destination:     Manali
  From:            Delhi
  Travel dates:    Oct 1 – Oct 5, 2025
  Trip type:       Solo
  Travel style:    Adventure
  Budget:          ₹20,000
  Travelers:       1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 2 — Website sends the data to the backend (0-1 second)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The website (Next.js) sends this to the Python server:

POST http://localhost:8000/api/v1/itinerary/generate
{
  "destination": "Manali",
  "origin": "Delhi",
  "start_date": "2025-10-01",
  "end_date": "2025-10-05",
  "trip_type": "solo",
  "travel_style": "adventure",
  "num_travelers": 1,
  "budget_inr": 20000
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 3 — Backend validates the request (instant)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FastAPI automatically checks:
  ✓ Is destination a string?         YES
  ✓ Is start_date a valid date?      YES
  ✓ Is end_date after start_date?    YES
  ✓ Is trip_type one of the allowed values? YES (solo/couple/family/group/expedition)
  ✓ Is budget_inr >= 1000?           YES (₹20,000 > ₹1,000 minimum)

If any check fails → returns error immediately, never calls Claude (saves API cost)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 4 — ItineraryAgent builds the message for Claude (instant)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The agent reads the prompt file (prompts/itinerary_builder.txt)
and combines it with the user's inputs.

  SYSTEM PROMPT (from itinerary_builder.txt):
  "You are Xplor360's ItineraryAgent — an expert Indian travel planner...
   Use real train numbers. Use INR costs. Return valid JSON. [10 rules...]"

  USER MESSAGE (built from the form data):
  "Plan a 5-day adventure trip from Delhi to Manali.
   Dates: Oct 1–5, 2025.
   1 solo traveler. Budget: ₹20,000.
   Travel style: adventure.
   Accommodation budget per night: ₹1,200 (30% of total / 5 nights)"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 5 — Claude thinks and responds (10–20 seconds)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The request goes to api.anthropic.com (Anthropic's servers in the cloud).
Claude reads both messages and generates a full JSON response.

This is the "thinking" phase. Nothing happens on your server during this time —
it's all happening on Anthropic's computers. Hence 10-20 seconds of waiting.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 6 — Claude's JSON is parsed (instant)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The backend receives Claude's text, parses it from JSON into Python objects,
and validates the structure.

If Claude returned malformed JSON → 502 error is returned to the user
(rare, but handled gracefully)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 7 — Hotel search runs in parallel (3–5 seconds)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

While Claude is thinking (or right after), the backend also searches for hotels:

  Unique overnight locations from the itinerary: ["Manali"]

  For "Manali":
    Amadeus → no IATA code for Manali → skip
    OpenTripMap → found 8 hotels near GPS (32.2396, 77.1887) → use these!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 8 — Results are merged (instant)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each day in the itinerary gets:
  accommodation_suggestions → from Claude (3 tiers: budget/mid/premium)
  accommodation_options     → from OpenTripMap (real hotels near the location)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 9 — Saved to database + returned to user (instant)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The complete itinerary is:
  → Saved to Supabase (itineraries + itinerary_days + itinerary_activities tables)
  → Returned to the website as JSON
  → Website renders the day-by-day plan on screen

Total time: approximately 12-20 seconds

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 13. The Prompt File — How You Talk to Claude

The most important file for controlling what Claude does is:

```
xplor360/prompts/itinerary_builder.txt
```

Every time someone generates a trip, this file is read and sent to Claude as its "instructions". Think of it as the job description you give a new employee.

### The file has two parts:

**Part 1 — Identity (who Claude is)**
```
You are Xplor360's ItineraryAgent — an expert Indian travel planner with deep knowledge of:
- All Indian states, regions, and destinations including offbeat options
- Indian transport options: trains (IRCTC classes), buses (state RTCs), flights (domestic routes)
- Accommodation across all price ranges: hostels, dharamshalas, OYO, boutique, resorts
- Real cost estimates in INR
- Cultural sensitivities, photography etiquette, religious customs
- Content creation opportunities for Instagram Reels and YouTube
```

**Part 2 — The 10 Rules Claude must follow**
```
1. Be specific: use real place names, real train numbers (e.g. 12905 Howrah Superfast)
2. Cost accuracy: use honest INR estimates matching the user's budget
3. content_opportunity: every activity must have a ContentPilot recording tip
4. Pace appropriately: don't over-schedule. Mountains = fewer activities
5. India-native language: use darshan, thali, chai, ghats naturally
6. Safety first: mention altitude warning for Ladakh/Spiti on Day 1
7. Packing list: tailor to destination + season, not a generic list
8. key_tips: practical, specific — not tourist brochure fluff
9. lat/lng: provide GPS for major landmarks you're confident about
10. Wrong season warning: if user picks Ladakh in January, warn them
```

**Part 3 — Exact JSON format to return**

The file also shows Claude exactly what structure its response must follow. This is critical — if Claude returns a different structure, the backend code can't parse it.

---

### Changing what Claude does

If you want to change the itinerary output, **you only need to edit the prompt file**. No code changes needed.

Examples:
- Want Claude to suggest restaurants by name? Add a rule: "Include one restaurant recommendation per meal"
- Want Bollywood filming locations? Add rule: "If the destination was used in any Bollywood film, mention the movie name and the scene"
- Want train booking links? Add rule: "Add irctc.co.in booking URL for every train mentioned"
- Want Hindi-language output? Add rule: "Respond in Hindi (Devanagari script) if user's preferred_lang is 'hi'"

---

## 14. What Claude Returns — Annotated Example

Here's a simplified version of what Claude sends back for a Manali trip:

```json
{
  "summary": "A raw, high-altitude adventure through the Kullu Valley...

                ↑ Claude writes this 2-3 sentence summary based on
                  the destination and travel style

  "total_estimated_cost_inr": 19800,

                ↑ Claude estimates the full cost per person.
                  For a ₹20,000 budget, it tries to stay within that range.

  "best_time_note": "October is ideal for Manali — post-monsoon clarity...",

                ↑ Claude evaluates the requested dates against best travel season

  "days": [
    {
      "day_number": 1,
      "title": "Delhi to Manali — The Night Bus Begins",

                ↑ Each day gets an evocative title

      "transport_for_day": "HRTC Volvo Bus from ISBT Kashmiri Gate (10 PM)",

                ↑ Claude uses REAL bus service names and departure points

      "overnight_location": "Manali",

                ↑ This short name is used to search for hotels.
                  Must be a single clean name (not "Manali, Himachal Pradesh")

      "estimated_cost_inr": 1200,

      "activities": [
        {
          "time": "22:00",
          "title": "Board HRTC Volvo at ISBT Kashmiri Gate",
          "description": "The overnight bus to Manali is part of the experience...",
          "location": "ISBT Kashmiri Gate, Delhi",
          "lat": 28.6757,
          "lng": 77.2167,
          "duration_minutes": 480,
          "cost_inr": 850,
          "content_opportunity": "Record a 30-sec 'pre-trip jitters' selfie video at the
                                   bus stand — speak directly to camera about why you're
                                   going solo. Save for your Reel intro."

                ↑ EVERY activity gets a ContentPilot tip. This is unique to Xplor360 —
                  it turns the trip plan into a content creation guide simultaneously.
        }
      ],

      "accommodation_suggestions": [
        {
          "tier": "budget",
          "name": "Zostel Manali",
          "description": "The most social hostel in Old Manali...",
          "estimated_price_per_night_inr": 600,
          "area": "Old Manali",
          "notable_for": "Best place to meet solo travelers and form groups"
        },
        {
          "tier": "mid",
          "name": "Apple Country Resort",
          "description": "Surrounded by apple orchards, 5-min walk from Mall Road...",
          "estimated_price_per_night_inr": 2800,
          "area": "Aleo, Manali",
          "notable_for": "Private balconies with mountain views"
        },
        {
          "tier": "premium",
          "name": "Span Resort & Spa",
          "description": "Heritage resort on the Beas riverbank...",
          "estimated_price_per_night_inr": 8500,
          "area": "Kullu-Manali Highway",
          "notable_for": "In-river natural pool and spa treatments"
        }
      ]
    }
    // ... Day 2, Day 3, Day 4, Day 5
  ],

  "packing_list": [
    {"category": "Clothing",   "item": "Thermal base layer (top + bottom)", "essential": true},
    {"category": "Clothing",   "item": "Windproof jacket",                  "essential": true},
    {"category": "Footwear",   "item": "Ankle-support trekking shoes",       "essential": true},
    {"category": "Health",     "item": "Diamox (altitude sickness pills)",   "essential": false},
    {"category": "Documents",  "item": "Himachal Pradesh permit (not needed for Manali)", "essential": false}
  ],

                ↑ Claude tailors this to Manali in October specifically —
                  NOT a generic packing list

  "key_tips": [
    "Book HRTC Volvo 2 weeks in advance — upper deck front seats fill first",
    "Carry ₹5,000 cash — ATMs in Spiti and Rohtang area frequently fail",
    "October mornings drop to 5°C — thermals are non-negotiable",
    "Solang Valley requires a permit (₹150) — get at the gate, not in Manali",
    "Atal Tunnel closes at 10 PM — factor this into Day 4 return planning"
  ]
}
```

---

## 15. Temperature — Creativity Dial

When the backend talks to Claude, it sets a "temperature" value:

```python
# In backend/app/services/llm.py

async def complete_json(prompt, system="") -> str:
    return await complete(prompt, system=json_system, temperature=0)
    # temperature=0 for structured JSON output

async def complete(prompt, system="", temperature=0.7) -> str:
    # temperature=0.7 for creative writing tasks
```

| Temperature | What it does | Used for |
|---|---|---|
| `0` | Deterministic — same input = same output every time | JSON generation, itineraries |
| `0.3` | Slightly varied | Formal blog posts |
| `0.7` | Balanced — creative but sensible | Instagram captions |
| `1.0` | Highly creative / unpredictable | Experimental copy |

For trip planning, we use `temperature=0` because we want structured, predictable JSON output. If Claude used `temperature=0.9`, it might sometimes return creative text instead of JSON — which would break the parser.

For caption writing, we use `temperature=0.7` because captions should feel natural and varied.

---

## 16. Why Two Claude Models?

```python
# In backend/app/services/llm.py

CLAUDE_PRIMARY = "claude-sonnet-4-6"      # Smart, thorough — for itineraries
CLAUDE_FAST    = "claude-haiku-4-5-20251001"  # Fast, cheap — for captions and summaries
```

| Model | Capability | Speed | Cost per 1M tokens |
|---|---|---|---|
| **claude-sonnet-4-6** | High reasoning, detailed output | 15-20 seconds | Higher |
| **claude-haiku-4-5-20251001** | Good for short tasks | 2-3 seconds | ~6x cheaper |

**Sonnet** is used when quality matters most — generating a full 5-day itinerary needs deep knowledge of Indian train routes, authentic place names, real cost estimates, altitude warnings.

**Haiku** is used when speed and cost matter more — generating Instagram captions or WhatsApp summaries doesn't need the same depth.

---

## 17. Cost — How Much Does Each Request Cost?

Claude charges based on how many "tokens" you use. Tokens are roughly 0.75 words each.

A typical 5-day itinerary request:
- System prompt (~700 tokens input)
- User message (~150 tokens input)
- Claude's full JSON response (~3,500 tokens output)
- Total: ~4,350 tokens

At current Sonnet pricing:
- ~₹1.50–₹2.50 per itinerary generated

This means if 100 users generate itineraries in a day, your Claude bill is ~₹150–₹250 that day.

**Tip for development:** Use the `itinerary_builder.txt` prompt to request shorter itineraries during testing. Add at the top: `"TESTING MODE: Return only Day 1. Skip detailed descriptions."` — costs 10x less. Remove before going live.

---

## 18. How to Change What Claude Does

The prompt file is your main lever. Here are practical examples:

### Example 1 — Add restaurant recommendations

Open `prompts/itinerary_builder.txt` and add to the RULES section:

```
11. Meals: For lunch and dinner activities, include one specific restaurant recommendation
    with its name, dish to order, and cost. Use real restaurant names you know.
    Format: [Restaurant: "Sharma ji ka Dhaba", try: "dal makhani + tandoori roti", cost: ₹180]
```

### Example 2 — Add safety notes for solo women

```
12. Solo female safety: if trip_type is solo and traveler is female, add a "safety_rating"
    field (1-5 stars) per activity and note which areas are well-lit at night.
```

### Example 3 — Add a budget breakdown

```
13. Budget breakdown: at the end, add a "budget_split" object:
    {
      "transport_inr": <total transport cost>,
      "accommodation_inr": <total accommodation cost>,
      "food_inr": <estimated food cost>,
      "activities_inr": <activities and entry fees>,
      "buffer_inr": <10% contingency>
    }
```

**You don't need to touch any Python or TypeScript code** to make any of these changes. The prompt is read fresh on every request.

---

## 19. The Hotel Search That Runs Alongside Claude

While Claude generates the itinerary, the backend also searches for actual hotels. This is the "accommodation waterfall":

```
STEP A: Does AMADEUS_CLIENT_ID exist in .env?
  YES → Search Amadeus Hotel API
        Got results? → Attach to itinerary → DONE ✓
        No results? (e.g. Manali has no airport) → Continue to Step B

  NO (key not set) → Skip to Step B

STEP B: Does OPENTRIPMAP_API_KEY exist in .env?
  YES → Search OpenTripMap (free, uses GPS radius)
        Got results? → Attach to itinerary → DONE ✓
        No results? → Continue to Step C

  NO (key not set) → Skip to Step C

STEP C: Use Mock data (always available, no key needed)
  → Returns realistic pre-built hotel data for 30 Indian destinations
  → ALWAYS returns something → DONE ✓
```

### For development (Day 1 setup)

You don't need Amadeus or OpenTripMap keys. The Mock provider always returns realistic hotel data for all major destinations. This means you can test the full app with ZERO paid hotel API keys.

### For production

1. **Register OpenTripMap** (completely free, 1,000 calls/day):
   - Go to: `https://opentripmap.io/register`
   - Get your key instantly
   - Add to `.env`: `OPENTRIPMAP_API_KEY=your-key`

2. **Register Amadeus** (free sandbox, 500 calls/month):
   - Go to: `https://developers.amadeus.com/register`
   - Create app → get `Client ID` and `Client Secret`
   - Add to `.env`:
     ```
     AMADEUS_CLIENT_ID=your-id
     AMADEUS_CLIENT_SECRET=your-secret
     AMADEUS_BASE_URL=https://test.api.amadeus.com
     ```

---

## 20. Common AI Questions Answered

---

**Q: Does Claude remember previous conversations?**

No. Each request to Claude is completely fresh — it has no memory of previous trips you've generated. Every time a user generates an itinerary, the full context (system prompt + user message) is sent again from scratch.

This is by design — it keeps things simple and secure.

---

**Q: Can Claude make things up (hallucinate)?**

Yes, sometimes. The prompt rules help reduce this:
- "Use real train numbers" → Claude is more careful to use actual IRCTC numbers
- "If you don't know a specific property, describe the type rather than inventing names"
- `temperature=0` → more conservative, less likely to invent

The Mock hotel provider also helps — if Claude suggests "Zostel Manali" and the real hotel is actually called that, great. If not, the OpenTripMap/Mock results give real options.

---

**Q: What happens if Claude's API is down?**

The backend returns a `503 Service Unavailable` error. The user sees "Service temporarily unavailable." This is rare — Anthropic's uptime is very high (99.9%+).

---

**Q: Can I use ChatGPT instead of Claude?**

Yes. The `llm.py` file is a thin wrapper — you'd change:
- The client from `anthropic` to `openai`
- The model names
- The response parsing (OpenAI and Anthropic have slightly different API shapes)

The prompt files, agent logic, and everything else stays identical.

---

**Q: What's the max itinerary length Claude can generate?**

The call uses `max_tokens=8192`, which is about 6,000 words of output. This comfortably covers:
- 14-day itinerary (8192 tokens)
- 5-day very detailed itinerary with extensive ContentPilot tips (8192 tokens)

For longer trips (21+ days), you'd need to request in two halves or increase max_tokens.

---

**Q: Can I cache responses to save money?**

Yes. If two users both request "Solo adventure to Manali, Oct 1-5", they'd get identical Claude calls. You could add a Redis cache keyed by `hash(destination + dates + trip_type + budget_range + num_travelers)`.

This is set up in the infrastructure (`REDIS_URL` in `.env`) but not yet wired to the itinerary agent. A future optimization.

---

**Q: How do I see what Claude actually said?**

Every itinerary stores `raw_llm_response` in the `itineraries` table in Supabase. Go to:

Supabase Dashboard → Table Editor → `itineraries` → click any row → see the `raw_llm_response` column.

This is invaluable for debugging if the parsed itinerary looks wrong.

---

## Summary Checklist

### Supabase Setup
- [ ] Created Supabase account and project (Mumbai/Singapore region)
- [ ] Copied Project URL, anon key, service_role key to a safe place
- [ ] Turned off email confirmation (for development)
- [ ] Ran `001_initial_schema.sql` → 19 tables created
- [ ] Ran `persona_archetypes.sql` → 20 traveler types loaded
- [ ] Ran `destinations.sql` → 30 destinations loaded
- [ ] Added Supabase keys to `backend/.env`
- [ ] Added Supabase keys to `web/.env.local` (anon key only)
- [ ] Backend starts without errors
- [ ] Can see data in Supabase Table Editor

### Claude Setup
- [ ] Created Anthropic account at console.anthropic.com
- [ ] Created API key (sk-ant-...)
- [ ] Added payment method and credits
- [ ] Added `ANTHROPIC_API_KEY` to `backend/.env`
- [ ] Generated a test itinerary via `localhost:8000/docs`

### Minimum Working Setup (Day 1)
These 4 variables are the only ones needed to run Xplor360:
```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
```
Everything else is optional and enables additional features.

---

*Document version: 1.0 | February 2026*
