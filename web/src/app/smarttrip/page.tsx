"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Send,
  ArrowRight,
  Star,
  Clock,
  IndianRupee,
  Hotel,
  Thermometer,
  CheckCircle2,
  LogIn,
  X,
  ChevronDown,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type Step =
  | "welcome"
  | "style"
  | "duration"
  | "budget"
  | "destinations"
  | "itinerary"
  | "accommodation"
  | "booking";

interface Persona {
  style?: string;
  duration?: string;
  budget?: string;
  destination?: string;
  destinationName?: string;
}

interface DestCard {
  id: string;
  name: string;
  state: string;
  weather: string;
  temp: string;
  badge?: string;
  why: string;
  highlights: string[];
}

interface ItinDay {
  day: number;
  label: string;
  theme: string;
  morning: string;
  afternoon: string;
  evening: string;
  cost: string;
}

interface Hotel {
  id: string;
  name: string;
  type: string;
  price: string;
  rating: number;
  perks: string[];
  badge?: string;
}

type MsgContent =
  | { kind: "text"; text: string }
  | { kind: "quickReplies"; text: string; options: { label: string; value: string; emoji?: string }[] }
  | { kind: "destinations"; text: string; items: DestCard[] }
  | { kind: "itinerary"; text: string; days: ItinDay[] }
  | { kind: "hotels"; text: string; items: Hotel[] }
  | { kind: "booking"; isGuest: boolean };

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: MsgContent;
}

// ─── Season context (Feb 28, late winter India) ──────────────────────────────

const SEASON_NOTE =
  "It's late February — perfect weather across Rajasthan, Goa & Kerala. Hill stations are still cold and beautiful.";

// ─── Destination Data ────────────────────────────────────────────────────────

const DESTS: Record<string, Record<string, DestCard[]>> = {
  adventure: {
    budget: [
      {
        id: "rishikesh",
        name: "Rishikesh",
        state: "Uttarakhand",
        weather: "Cool & clear",
        temp: "12–22°C",
        badge: "Pre-peak — less crowd",
        why: "India's adventure capital. February is ideal for rafting before the Ganga swells.",
        highlights: ["White-water rafting (Grade 3–5)", "Bungee jumping", "Cliff jumping", "Yoga & meditation"],
      },
      {
        id: "hampi",
        name: "Hampi",
        state: "Karnataka",
        weather: "Warm & breezy",
        temp: "22–32°C",
        badge: "Ideal season",
        why: "Ancient ruins meet bouldering paradise. The weather is perfect right now.",
        highlights: ["Rock climbing & bouldering", "Coracle river ride", "Vittala Temple", "Sunset at Hemakuta Hill"],
      },
      {
        id: "chopta",
        name: "Chopta",
        state: "Uttarakhand",
        weather: "Snowy & crisp",
        temp: "−2 to 10°C",
        badge: "Snow season",
        why: "A hidden gem for snow trekking and untouched winter scenery.",
        highlights: ["Tungnath Temple trek", "Snow camping", "Chandrashila summit", "Minimal tourist footprint"],
      },
    ],
    mid: [
      {
        id: "corbett",
        name: "Jim Corbett",
        state: "Uttarakhand",
        weather: "Warm days, cool nights",
        temp: "10–28°C",
        badge: "Peak safari season",
        why: "February is the best month for tiger sightings before summer.",
        highlights: ["Jeep & elephant safaris", "Tiger & leopard sightings", "Bird watching (over 600 species)", "Jungle night camps"],
      },
      {
        id: "ranthambore",
        name: "Ranthambore",
        state: "Rajasthan",
        weather: "Pleasant & sunny",
        temp: "15–28°C",
        badge: "Best time to visit",
        why: "Dry forests make wildlife viewing easy. Royal surroundings add to the magic.",
        highlights: ["Tiger safari (one of India's best)", "Ranthambore Fort", "Bird photography", "Stepwells & temples"],
      },
    ],
    luxury: [
      {
        id: "andaman",
        name: "Andaman Islands",
        state: "A&N Islands",
        weather: "Tropical & sunny",
        temp: "25–32°C",
        badge: "Perfect weather",
        why: "Crystal-clear seas and luxury diving. February is among the best months.",
        highlights: ["Scuba diving & snorkelling", "Radhanagar Beach (Asia's finest)", "Glass-bottom kayaking", "Sea-plane transfers"],
      },
    ],
  },
  cultural: {
    budget: [
      {
        id: "varanasi",
        name: "Varanasi",
        state: "Uttar Pradesh",
        weather: "Cool & pleasant",
        temp: "14–26°C",
        badge: "Best season",
        why: "Winter mornings on the ghats are ethereal — fog, boats, and the Ganga Aarti.",
        highlights: ["Ganga Aarti at Dashashwamedh Ghat", "Boat ride at dawn", "Silk weaving workshops", "Sarnath Buddhist site"],
      },
      {
        id: "hampi-c",
        name: "Hampi",
        state: "Karnataka",
        weather: "Warm & breezy",
        temp: "22–32°C",
        badge: "Ideal season",
        why: "UNESCO heritage site with ancient Vijayanagara Empire ruins in stunning landscape.",
        highlights: ["Virupaksha Temple", "Lotus Mahal & Elephant stables", "Archaeological museum", "Hippy Island cafes"],
      },
    ],
    mid: [
      {
        id: "jaipur",
        name: "Jaipur",
        state: "Rajasthan",
        weather: "Sunny & clear",
        temp: "16–28°C",
        badge: "🔥 Peak season — must visit",
        why: "The Pink City is at its finest in February. Cool days for fort exploration.",
        highlights: ["Amber Fort (elephant / jeep ride)", "Hawa Mahal & City Palace", "Jantar Mantar (UNESCO)", "Block printing & bazaars"],
      },
      {
        id: "udaipur",
        name: "Udaipur",
        state: "Rajasthan",
        weather: "Sunny & calm",
        temp: "15–27°C",
        badge: "Perfect weather",
        why: "City of lakes at its most romantic. Sunsets over Pichola are unforgettable.",
        highlights: ["Lake Pichola boat ride", "City Palace Museum", "Bagore Ki Haveli show", "Old city alleyways"],
      },
    ],
    luxury: [
      {
        id: "jodhpur",
        name: "Jodhpur",
        state: "Rajasthan",
        weather: "Warm & golden",
        temp: "18–30°C",
        badge: "Best time",
        why: "The Blue City and Mehrangarh Fort are spectacular. Luxury palace hotels await.",
        highlights: ["Mehrangarh Fort (one of India's finest)", "Blue City rooftop views", "Umaid Bhawan Palace tour", "Spice market walk"],
      },
    ],
  },
  relaxation: {
    budget: [
      {
        id: "gokarna",
        name: "Gokarna",
        state: "Karnataka",
        weather: "Warm & sunny",
        temp: "24–32°C",
        badge: "Ideal season",
        why: "Quieter than Goa but equally beautiful beaches with a laid-back spiritual vibe.",
        highlights: ["Om Beach & Half Moon Beach", "Kudle Beach sunrise", "Mahabaleshwar Temple", "Beach cafes & hammocks"],
      },
      {
        id: "varkala",
        name: "Varkala",
        state: "Kerala",
        weather: "Warm & breezy",
        temp: "25–32°C",
        badge: "Perfect weather",
        why: "Dramatic cliffside beach with Ayurveda spas and a calming spiritual energy.",
        highlights: ["North Cliff beach walk", "Ayurveda massage & spa", "Mineral springs beach", "Sunset over the Arabian Sea"],
      },
    ],
    mid: [
      {
        id: "goa",
        name: "Goa",
        state: "Goa",
        weather: "Sunny & perfect",
        temp: "26–32°C",
        badge: "🔥 Peak season — best now!",
        why: "February is Goa's golden window — great weather, markets, music, and beaches.",
        highlights: ["North Goa party beaches", "Dudhsagar Falls jeep trek", "Anjuna Flea Market", "Old Goa churches (UNESCO)"],
      },
      {
        id: "alleppey",
        name: "Alleppey",
        state: "Kerala",
        weather: "Pleasant & calm",
        temp: "24–30°C",
        badge: "Ideal season",
        why: "The backwaters are at their serene best in February. Houseboat life is unmissable.",
        highlights: ["Houseboat cruise stay overnight", "Village coir-weaving tours", "Toddy shop experience", "Sunrise over the backwaters"],
      },
    ],
    luxury: [
      {
        id: "andaman-lux",
        name: "Andaman Islands",
        state: "A&N Islands",
        weather: "Tropical bliss",
        temp: "26–32°C",
        badge: "Perfect weather",
        why: "Private beach resorts, underwater world, and total seclusion at its finest.",
        highlights: ["Private beach resort access", "Luxury snorkelling & diving", "Sunset dinner on the beach", "Seaplane & yacht transfers"],
      },
    ],
  },
  family: {
    budget: [
      {
        id: "ooty",
        name: "Ooty",
        state: "Tamil Nadu",
        weather: "Cool & pleasant",
        temp: "10–20°C",
        badge: "Great weather",
        why: "The Nilgiris toy train is a UNESCO heritage experience kids absolutely love.",
        highlights: ["Nilgiri Mountain Railway", "Botanical Garden (150+ years old)", "Ooty Lake boating", "Doddabetta peak viewpoint"],
      },
    ],
    mid: [
      {
        id: "goa-fam",
        name: "Goa",
        state: "Goa",
        weather: "Sunny & safe",
        temp: "26–32°C",
        badge: "Family favourite",
        why: "Calm north beaches, water parks, and spice plantations are perfect for families.",
        highlights: ["Calangute & Candolim (calm beaches)", "Splash water park", "Spice plantation lunch tour", "Aguada Fort & lighthouse"],
      },
      {
        id: "jaipur-fam",
        name: "Jaipur",
        state: "Rajasthan",
        weather: "Pleasant days",
        temp: "16–28°C",
        badge: "Best time to visit",
        why: "Forts, elephant rides, puppet shows, and Chokhi Dhani — perfect for all ages.",
        highlights: ["Elephant ride up Amber Fort", "Chokhi Dhani cultural village", "Puppet show & folk dance", "Light & Sound show at Amber"],
      },
    ],
    luxury: [
      {
        id: "coorg-lux",
        name: "Coorg",
        state: "Karnataka",
        weather: "Cool & misty",
        temp: "15–25°C",
        badge: "Luxury retreat",
        why: "Luxury eco-resorts amid coffee estates. Treehouse stays kids will never forget.",
        highlights: ["Luxury treehouse stays", "Coffee plantation tour & tasting", "Elephant interaction camp", "Abbey Falls & Raja's Seat"],
      },
    ],
  },
};

// ─── Itinerary Data ──────────────────────────────────────────────────────────

const ITINS: Record<string, ItinDay[]> = {
  jaipur: [
    { day: 1, label: "Day 1", theme: "Pink City Arrival", morning: "Arrive & check-in. Stroll through the colourful old bazaars around Hawa Mahal.", afternoon: "Jantar Mantar (UNESCO astronomical observatory) + City Palace Museum.", evening: "Chokhi Dhani — folk dances, puppet show, authentic Rajasthani thali dinner.", cost: "~₹2,500/person" },
    { day: 2, label: "Day 2", theme: "Majestic Forts", morning: "Amber Fort: jeep/elephant ride up, Sheesh Mahal (mirror palace), rampart walk.", afternoon: "Nahargarh Fort for panoramic city views. Lunch at the rooftop cafe inside.", evening: "Bapu Bazaar & Johari Bazaar for jootis, block prints, blue pottery & gems.", cost: "~₹2,200/person" },
    { day: 3, label: "Day 3", theme: "Hidden Jaipur", morning: "Jal Mahal (Water Palace) photo-stop. Kanak Vrindavan garden.", afternoon: "Albert Hall Museum + local home-kitchen lunch experience.", evening: "Sunset at the Step-well (Panna Meena ka Kund). Departure or extend to Udaipur.", cost: "~₹1,800/person" },
  ],
  goa: [
    { day: 1, label: "Day 1", theme: "Beach Arrival", morning: "Arrive & head straight to Baga or Calangute Beach — first swim of the trip.", afternoon: "Beachside lunch: fish curry rice, prawn balchão, sol kadhi.", evening: "Tito's Lane shacks for live music, seafood & the Goa vibe.", cost: "~₹3,500/person" },
    { day: 2, label: "Day 2", theme: "Adventure Day", morning: "Dudhsagar Waterfall jeep trek — must book the day before.", afternoon: "Aguada Fort & Sinquerim Beach for a calmer swim.", evening: "Anjuna Flea Market (Wed) or Arpora Night Market (Sat). Street food crawl.", cost: "~₹3,000/person" },
    { day: 3, label: "Day 3", theme: "South Goa Escape", morning: "Drive to Palolem Beach — quieter, crescent-shaped, pristine.", afternoon: "Kayaking at Butterfly Beach or snorkelling at Colomb Bay.", evening: "Sundowner at the cliff. Fresh catch BBQ dinner right on the beach.", cost: "~₹2,800/person" },
    { day: 4, label: "Day 4", theme: "Culture & Departure", morning: "Old Goa: Basilica of Bom Jesus + Se Cathedral (both UNESCO).", afternoon: "Spice plantation tour with traditional Goan lunch. Head to station/airport.", evening: "Depart with Goa in your heart.", cost: "~₹2,000/person" },
  ],
  rishikesh: [
    { day: 1, label: "Day 1", theme: "Adventure Arrival", morning: "Arrive, check in to riverside camp or hostel. Stroll the Ram Jhula bridge.", afternoon: "Intro to rafting — short stretch on the Ganga (Grade 2-3).", evening: "Ganga Aarti at Triveni Ghat. Dinner at a riverside cafe.", cost: "~₹2,000/person" },
    { day: 2, label: "Day 2", theme: "Full Adrenaline", morning: "Full-day whitewater rafting (Grade 3-5, 16 km stretch from Shivpuri).", afternoon: "Rest and recover. Optional: bungee jump or giant swing at Jumpin Heights.", evening: "Bonfire at camp. Jam sessions with fellow travellers.", cost: "~₹2,500/person" },
    { day: 3, label: "Day 3", theme: "Yoga & Departure", morning: "Sunrise yoga at a Rishikesh ashram (many are free or ₹200–500).", afternoon: "Beatles Ashram (Chaurasi Kutia). Lachhman Jhula walk. Street shopping.", evening: "Departure with a charged soul.", cost: "~₹1,500/person" },
  ],
  varanasi: [
    { day: 1, label: "Day 1", theme: "Sacred Arrival", morning: "Arrive. Evening boat ride on the Ganga to watch sunset from the river.", afternoon: "Explore Vishwanath Gali (Kashi lane) — temples, sweets, silk shops.", evening: "Dashashwamedh Ghat Ganga Aarti — magnificent 7-priest ceremony.", cost: "~₹1,800/person" },
    { day: 2, label: "Day 2", theme: "Dawn on the Ghats", morning: "4 AM boat ride — fog, silence, and the city waking up on the ghats.", afternoon: "Sarnath (30 min away): where Buddha first taught. Museum & stupas.", evening: "Home-cooked Banarasi thali dinner. Evening walk through old city lanes.", cost: "~₹2,000/person" },
    { day: 3, label: "Day 3", theme: "Craft & Culture", morning: "Silk weaving cooperative visit — see Banarasi saree being made.", afternoon: "Ramnagar Fort across the river. Departure.", evening: "Farewell chai at a ghat-side stall.", cost: "~₹1,500/person" },
  ],
  alleppey: [
    { day: 1, label: "Day 1", theme: "Backwater Arrival", morning: "Arrive at Alleppey (Alappuzha). Board your houseboat after noon check-in.", afternoon: "Glide through narrow canals, paddy fields, and coconut groves.", evening: "Sunset from the deck. Fresh Kerala meals cooked onboard by your cook.", cost: "~₹4,500/person (incl. houseboat)" },
    { day: 2, label: "Day 2", theme: "Village Life", morning: "Sunrise on the backwaters. Village walk — coir making, toddy tapping.", afternoon: "Kayaking the narrow canals (better than the boat for intimacy). Village lunch.", evening: "Depart or extend to Kumarakom for bird sanctuary.", cost: "~₹2,500/person" },
  ],
};

// ─── Hotel Data ──────────────────────────────────────────────────────────────

const HOTELS: Record<string, Hotel[]> = {
  jaipur: [
    { id: "zostel-j", name: "Zostel Jaipur", type: "Social Hostel", price: "₹700–1,400 / night", rating: 4.4, perks: ["Rooftop chill zone", "Free breakfast", "City tour desk", "Traveller community"] },
    { id: "pearl", name: "Hotel Pearl Palace", type: "Boutique Hotel", price: "₹2,800–4,500 / night", rating: 4.7, perks: ["Heritage architecture", "Rooftop restaurant & bar", "AC rooms", "Free airport pickup"], badge: "Most Loved" },
    { id: "rambagh", name: "Rambagh Palace (Taj)", type: "Luxury Heritage Palace", price: "₹28,000–48,000 / night", rating: 4.9, perks: ["Former royal palace", "Spa & multiple pools", "Fine dining & high tea", "Elephant polo grounds"] },
  ],
  goa: [
    { id: "jungle-goa", name: "Jungle Book Hostel", type: "Beach Party Hostel", price: "₹600–1,500 / night", rating: 4.5, perks: ["5 min walk to beach", "Pool & bar", "Games room", "Lively social scene"] },
    { id: "w-goa", name: "W Goa", type: "Beachfront Resort", price: "₹9,000–16,000 / night", rating: 4.7, perks: ["Beachfront rooms", "Infinity pool & WET bar", "Free breakfast", "Curated beach activities"], badge: "Best Value" },
    { id: "leela-goa", name: "The Leela Goa", type: "Luxury Beach Resort", price: "₹22,000–42,000 / night", rating: 4.9, perks: ["Private beach", "Championship golf", "Ayurveda spa", "Fine dining buffet"] },
  ],
  rishikesh: [
    { id: "zostel-r", name: "Zostel Rishikesh", type: "River Camp Hostel", price: "₹550–1,200 / night", rating: 4.6, perks: ["Riverside location", "Community bonfires", "Trek & rafting bookings", "Yoga sessions"] },
    { id: "camp-r", name: "Camp Ganga Beach", type: "Luxury Camp", price: "₹3,500–6,000 / night", rating: 4.5, perks: ["Swiss tents on riverbank", "All meals included", "Campfire evenings", "Adventure package deals"], badge: "Most Popular" },
    { id: "atali", name: "Atali Ganga Resort", type: "Premium River Resort", price: "₹12,000–20,000 / night", rating: 4.8, perks: ["Luxury riverside cottages", "Private rafting arrangements", "Spa & yoga pavilion", "Gourmet meals"] },
  ],
  varanasi: [
    { id: "moustache", name: "Moustache Hostel", type: "Ghat-View Hostel", price: "₹450–900 / night", rating: 4.5, perks: ["Ganga view rooms", "Ghat tours included", "Rooftop chai spot", "Budget traveller favourite"] },
    { id: "brijrama", name: "Brijrama Palace", type: "Heritage Haveli Hotel", price: "₹8,000–15,000 / night", rating: 4.7, perks: ["17th-century heritage palace", "Ganga-view rooms", "In-house chef", "Private ghat access"], badge: "Iconic Stay" },
  ],
  alleppey: [
    { id: "houseboat-std", name: "Premium Houseboat (1 BR)", type: "Traditional Kettuvallam", price: "₹7,000–12,000 / night", rating: 4.6, perks: ["All meals by onboard cook", "Canal & lake cruise", "Sunset deck", "Complete privacy"] },
    { id: "houseboat-lux", name: "Luxury Houseboat (2 BR)", type: "Premium Kettuvallam", price: "₹15,000–25,000 / night", rating: 4.8, perks: ["2 bedrooms + living room", "Chef + crew", "Open-air dining deck", "Private canoe included"], badge: "Xplor Pick" },
  ],
};

const getFallbackDests = (style: string, budget: string): DestCard[] => {
  const styleData = DESTS[style] || DESTS["relaxation"];
  const budgetKey = budget === "budget" ? "budget" : budget === "mid" ? "mid" : "luxury";
  return styleData[budgetKey] || styleData["mid"] || styleData["budget"] || [];
};

const getHotels = (destId: string): Hotel[] => {
  // Match by destination id prefix
  for (const key of Object.keys(HOTELS)) {
    if (destId.startsWith(key) || destId === key || destId.includes(key)) {
      return HOTELS[key];
    }
  }
  return HOTELS["goa"]; // fallback
};

const getItinerary = (destId: string): ItinDay[] => {
  for (const key of Object.keys(ITINS)) {
    if (destId.startsWith(key) || destId === key || destId.includes(key)) {
      return ITINS[key];
    }
  }
  return ITINS["goa"]; // fallback
};

// ─── Unique ID helper ────────────────────────────────────────────────────────

let _id = 0;
const uid = () => `m${++_id}`;

// ─── Persona label helpers ────────────────────────────────────────────────────

const styleLabel: Record<string, string> = {
  adventure: "Adventure Seeker",
  cultural: "Cultural Explorer",
  relaxation: "Relaxation Mode",
  family: "Family Traveller",
};

const budgetLabel: Record<string, string> = {
  budget: "Budget (under ₹3k/day)",
  mid: "Mid-range (₹3k–10k/day)",
  luxury: "Luxury (₹10k+/day)",
};

// ─── Component ───────────────────────────────────────────────────────────────

function SmartTripChat() {
  const searchParams = useSearchParams();
  const isGuest = searchParams.get("mode") === "guest";

  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>("welcome");
  const [persona, setPersona] = useState<Persona>({});
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Kick off welcome message on mount
  useEffect(() => {
    const welcome: Msg = {
      id: uid(),
      role: "assistant",
      content: {
        kind: "quickReplies",
        text: isGuest
          ? `Hey there, explorer! 👋\n\nWelcome to **SmartTrip** — I'm your AI travel companion.\n\nIt's late February — an incredible time for Rajasthan, Goa, and Kerala. Let me plan your perfect trip. First, I'd love to know what kind of traveller you are!`
          : `Welcome back! 🌟\n\nI'm your SmartTrip AI. It's late February — golden season for Rajasthan, Goa & Kerala. Let's plan something special.\n\nWhat kind of traveller are you right now?`,
        options: [
          { label: "Adventure Seeker", value: "adventure", emoji: "🧗" },
          { label: "Cultural Explorer", value: "cultural", emoji: "🏛️" },
          { label: "Relaxation Mode", value: "relaxation", emoji: "🏖️" },
          { label: "Family Traveller", value: "family", emoji: "👨‍👩‍👧" },
        ],
      },
    };
    setMessages([welcome]);
    setStep("style");
  }, [isGuest]);

  const pushAssistant = (content: MsgContent, delay = 900) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: uid(), role: "assistant", content }]);
    }, delay);
  };

  const pushUser = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", content: { kind: "text", text } },
    ]);
  };

  const handleQuickReply = (label: string, value: string) => {
    pushUser(label);

    if (step === "style") {
      setPersona((p) => ({ ...p, style: value }));
      setStep("duration");
      pushAssistant({
        kind: "quickReplies",
        text: `Love it — ${styleLabel[value]}! ✈️\n\nHow many days are you planning to travel?`,
        options: [
          { label: "Weekend (2–3 days)", value: "weekend", emoji: "🌅" },
          { label: "Short trip (4–7 days)", value: "short", emoji: "📅" },
          { label: "Extended (8–14 days)", value: "extended", emoji: "🗓️" },
          { label: "Long journey (2+ weeks)", value: "long", emoji: "🌍" },
        ],
      });
    } else if (step === "duration") {
      setPersona((p) => ({ ...p, duration: value }));
      setStep("budget");
      pushAssistant({
        kind: "quickReplies",
        text: "Got it! And what's your budget per person per day?",
        options: [
          { label: "Budget (under ₹3,000)", value: "budget", emoji: "💰" },
          { label: "Mid-range (₹3k–10k)", value: "mid", emoji: "💳" },
          { label: "Luxury (₹10k+)", value: "luxury", emoji: "💎" },
        ],
      });
    } else if (step === "budget") {
      const updatedPersona = { ...persona, budget: value };
      setPersona(updatedPersona);
      setStep("destinations");

      const style = updatedPersona.style || "relaxation";
      const budget = value;
      const dests = getFallbackDests(style, budget);

      pushAssistant(
        {
          kind: "destinations",
          text: `🌟 Based on your profile + it being late February...\n\n${SEASON_NOTE}\n\nHere are my top picks for you:`,
          items: dests.slice(0, 3),
        },
        1200
      );
    } else if (step === "destinations") {
      // This is handled by card click — shouldn't reach here
    }
  };

  const handleDestinationSelect = (dest: DestCard) => {
    setPersona((p) => ({ ...p, destination: dest.id, destinationName: dest.name }));
    pushUser(`I want to go to ${dest.name}!`);
    setStep("itinerary");

    const days = getItinerary(dest.id);
    pushAssistant(
      {
        kind: "itinerary",
        text: `Excellent choice! **${dest.name}** in ${dest.weather.toLowerCase()} at ${dest.temp} — perfect. 🎯\n\nHere's your personalised itinerary:`,
        days,
      },
      1400
    );

    // After itinerary, push accommodation
    setTimeout(() => {
      setStep("accommodation");
      const hotels = getHotels(dest.id);
      pushAssistant(
        {
          kind: "hotels",
          text: `Now let's find you a place to stay in **${dest.name}**. Here are curated options across budgets:`,
          items: hotels,
        },
        3200
      );
    }, 0);
  };

  const handleHotelSelect = (hotel: Hotel) => {
    pushUser(`I like ${hotel.name}!`);
    setStep("booking");
    pushAssistant(
      {
        kind: "booking",
        isGuest,
      },
      1000
    );
  };

  const handleSend = () => {
    if (!input.trim()) return;
    pushUser(input);
    setInput("");
    // Generic contextual reply
    pushAssistant({
      kind: "text",
      text: `Got it! I'm factoring that into your trip plan for ${persona.destinationName || "your destination"}. Feel free to tell me more, or scroll up to select a destination or hotel.`,
    });
  };

  const stepLabels: Record<Step, string> = {
    welcome: "Starting",
    style: "Travel Style",
    duration: "Trip Duration",
    budget: "Budget",
    destinations: "Destinations",
    itinerary: "Itinerary",
    accommodation: "Accommodation",
    booking: "Booking",
  };

  const stepOrder: Step[] = ["style", "duration", "budget", "destinations", "itinerary", "accommodation", "booking"];
  const stepIdx = stepOrder.indexOf(step);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* ── Top Bar ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-100 bg-white z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <Compass size={15} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm hidden sm:block">Xplor360</span>
          </Link>
          <span className="text-gray-200">|</span>
          <span className="text-sm font-semibold text-gray-700">SmartTrip</span>
          {isGuest && (
            <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full hidden sm:block">
              Guest Mode
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Progress — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {stepOrder.slice(0, 5).map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < stepIdx
                      ? "bg-orange-500"
                      : i === stepIdx
                      ? "bg-orange-400 ring-2 ring-orange-200"
                      : "bg-gray-200"
                  }`}
                />
                {i < 4 && <div className="w-4 h-px bg-gray-200" />}
              </div>
            ))}
            <span className="text-xs text-gray-400 ml-2">{stepLabels[step]}</span>
          </div>

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setShowSidebar(true)}
            className="md:hidden text-xs text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
          >
            Trip <ChevronDown size={12} />
          </button>

          {isGuest ? (
            <Link
              href="/auth/signup"
              className="flex items-center gap-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-full transition-colors"
            >
              <LogIn size={12} />
              Sign up to save
            </Link>
          ) : (
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
              U
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden md:flex flex-col w-72 border-r border-gray-100 bg-gray-50 p-5 overflow-y-auto flex-shrink-0">
          {/* Season context */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer size={14} className="text-orange-500" />
              <span className="text-xs font-semibold text-orange-700">Late February 2026</span>
            </div>
            <p className="text-xs text-orange-600 leading-relaxed">{SEASON_NOTE}</p>
          </div>

          {/* Persona card */}
          {(persona.style || persona.budget || persona.destinationName) && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your Profile</p>
              <div className="space-y-2">
                {persona.style && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-orange-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700">{styleLabel[persona.style]}</span>
                  </div>
                )}
                {persona.duration && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-orange-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 capitalize">{persona.duration} trip</span>
                  </div>
                )}
                {persona.budget && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-orange-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700">{budgetLabel[persona.budget]}</span>
                  </div>
                )}
                {persona.destinationName && (
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-orange-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 font-medium">{persona.destinationName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress steps */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Planning Progress</p>
            {[
              { label: "Travel Style", step: "style" as Step },
              { label: "Trip Duration", step: "duration" as Step },
              { label: "Budget", step: "budget" as Step },
              { label: "Destinations", step: "destinations" as Step },
              { label: "Itinerary", step: "itinerary" as Step },
              { label: "Accommodation", step: "accommodation" as Step },
              { label: "Book & Save", step: "booking" as Step },
            ].map(({ label, step: s }, i) => (
              <div key={s} className="flex items-center gap-2.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    stepOrder.indexOf(s) < stepIdx
                      ? "bg-orange-500 text-white"
                      : stepOrder.indexOf(s) === stepIdx
                      ? "bg-orange-100 text-orange-600 ring-2 ring-orange-300"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {stepOrder.indexOf(s) < stepIdx ? "✓" : i + 1}
                </div>
                <span
                  className={`text-xs ${
                    stepOrder.indexOf(s) <= stepIdx ? "text-gray-700 font-medium" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {isGuest && (
            <div className="mt-auto pt-5">
              <div className="bg-orange-500 rounded-2xl p-4 text-center">
                <p className="text-white text-xs font-semibold mb-1">Save your trip</p>
                <p className="text-orange-100 text-xs mb-3">Sign up to book and access your itinerary anytime</p>
                <Link href="/auth/signup" className="block bg-white text-orange-500 text-xs font-bold py-2 rounded-xl hover:bg-orange-50 transition-colors">
                  Create free account
                </Link>
              </div>
            </div>
          )}
        </aside>

        {/* ── Mobile sidebar overlay ── */}
        {showSidebar && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="flex-1 bg-black/40" onClick={() => setShowSidebar(false)} />
            <div className="w-72 bg-white border-l border-gray-100 p-5 overflow-y-auto flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-800 text-sm">Trip Details</span>
                <button onClick={() => setShowSidebar(false)}>
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-4">
                <p className="text-xs font-semibold text-orange-700 mb-1">Late February 2026</p>
                <p className="text-xs text-orange-600">{SEASON_NOTE}</p>
              </div>
              {persona.style && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  {persona.style && <p className="text-xs text-gray-700">{styleLabel[persona.style]}</p>}
                  {persona.budget && <p className="text-xs text-gray-700">{budgetLabel[persona.budget]}</p>}
                  {persona.destinationName && <p className="text-xs font-semibold text-orange-600">{persona.destinationName}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Chat Area ── */}
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto chat-scroll px-4 md:px-8 py-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`msg-appear flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-2.5 flex-shrink-0 mt-0.5">
                    <Compass size={15} className="text-white" />
                  </div>
                )}

                <div className={`max-w-xl w-full ${msg.role === "user" ? "max-w-xs" : ""}`}>
                  {msg.content.kind === "text" && (
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-orange-500 text-white rounded-tr-md"
                          : "bg-white border border-gray-100 text-gray-800 rounded-tl-md shadow-sm"
                      }`}
                    >
                      {msg.content.text}
                    </div>
                  )}

                  {msg.content.kind === "quickReplies" && (
                    <div>
                      <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm mb-3">
                        {msg.content.text}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.content.options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleQuickReply(
                              `${opt.emoji ? opt.emoji + " " : ""}${opt.label}`,
                              opt.value
                            )}
                            className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-gray-700 hover:text-orange-700 text-xs font-medium px-3.5 py-2 rounded-full transition-all card-hover"
                          >
                            {opt.emoji && <span>{opt.emoji}</span>}
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.content.kind === "destinations" && (
                    <div>
                      <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm mb-3">
                        {msg.content.text}
                      </div>
                      <div className="grid gap-3">
                        {msg.content.items.map((dest) => (
                          <button
                            key={dest.id}
                            onClick={() => handleDestinationSelect(dest)}
                            className="text-left bg-white border border-gray-200 hover:border-orange-400 rounded-2xl p-4 transition-all card-hover shadow-sm group"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-semibold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">
                                  {dest.name}
                                </div>
                                <div className="text-xs text-gray-400">{dest.state}</div>
                              </div>
                              {dest.badge && (
                                <span className="text-[10px] bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                                  {dest.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-3 leading-relaxed">{dest.why}</p>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Thermometer size={11} className="text-orange-400" />
                                {dest.temp}
                              </div>
                              <div className="text-xs text-gray-500">{dest.weather}</div>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {dest.highlights.slice(0, 3).map((h) => (
                                <span key={h} className="text-[10px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-full">
                                  {h}
                                </span>
                              ))}
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-xs text-orange-500 font-medium">
                              Pick this destination <ArrowRight size={12} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.content.kind === "itinerary" && (
                    <div>
                      <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm mb-3">
                        {msg.content.text}
                      </div>
                      <div className="space-y-2.5">
                        {msg.content.days.map((day) => (
                          <div key={day.day} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <div className="bg-orange-50 border-b border-orange-100 px-4 py-2.5 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                  {day.day}
                                </div>
                                <span className="font-semibold text-gray-800 text-sm">{day.theme}</span>
                              </div>
                              <span className="text-xs text-orange-600 font-medium">{day.cost}</span>
                            </div>
                            <div className="p-4 space-y-2">
                              {[
                                { label: "Morning", icon: "🌅", text: day.morning },
                                { label: "Afternoon", icon: "☀️", text: day.afternoon },
                                { label: "Evening", icon: "🌙", text: day.evening },
                              ].map(({ label, icon, text }) => (
                                <div key={label} className="flex gap-2.5">
                                  <span className="text-sm flex-shrink-0 mt-0.5">{icon}</span>
                                  <div>
                                    <span className="text-xs font-semibold text-gray-400 block">{label}</span>
                                    <span className="text-xs text-gray-700 leading-relaxed">{text}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.content.kind === "hotels" && (
                    <div>
                      <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm mb-3">
                        {msg.content.text}
                      </div>
                      <div className="grid gap-3">
                        {msg.content.items.map((hotel) => (
                          <button
                            key={hotel.id}
                            onClick={() => handleHotelSelect(hotel)}
                            className="text-left bg-white border border-gray-200 hover:border-orange-400 rounded-2xl p-4 transition-all card-hover shadow-sm group"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <div className="font-semibold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">
                                  {hotel.name}
                                </div>
                                <div className="text-xs text-gray-400">{hotel.type}</div>
                              </div>
                              <div className="text-right flex-shrink-0 ml-2">
                                {hotel.badge && (
                                  <span className="block text-[10px] bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full mb-1">
                                    {hotel.badge}
                                  </span>
                                )}
                                <div className="flex items-center gap-1 justify-end">
                                  <Star size={11} className="text-amber-400 fill-amber-400" />
                                  <span className="text-xs text-gray-600 font-medium">{hotel.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              <IndianRupee size={11} className="text-green-600" />
                              <span className="text-xs font-semibold text-green-700">{hotel.price}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {hotel.perks.slice(0, 3).map((p) => (
                                <span key={p} className="text-[10px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-full">
                                  {p}
                                </span>
                              ))}
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-xs text-orange-500 font-medium">
                              Select this stay <ArrowRight size={12} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.content.kind === "booking" && (
                    <div>
                      <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed shadow-sm mb-3">
                        {`Your trip to ${persona.destinationName || "your destination"} is fully planned! 🎉\n\nItinerary ✓  ·  Accommodation ✓  ·  Ready to book`}
                      </div>
                      <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 text-white">
                        {msg.content.isGuest ? (
                          <>
                            <h3 className="font-bold text-base mb-1">Save & Book Your Trip</h3>
                            <p className="text-orange-100 text-xs mb-4">
                              Create a free account to save this itinerary, get booking links, and access it from anywhere.
                            </p>
                            <div className="flex gap-2">
                              <Link href="/auth/signup" className="flex-1 bg-white text-orange-500 text-sm font-bold py-2.5 rounded-xl text-center hover:bg-orange-50 transition-colors">
                                Create free account
                              </Link>
                              <Link href="/auth/login" className="flex items-center gap-1 text-white/80 text-xs px-3 py-2.5 border border-white/30 rounded-xl hover:bg-white/10 transition-colors">
                                Sign in
                              </Link>
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="font-bold text-base mb-1">Proceed to Book</h3>
                            <p className="text-orange-100 text-xs mb-4">
                              Your itinerary and accommodation are saved. Review and confirm your booking.
                            </p>
                            <button className="w-full bg-white text-orange-500 text-sm font-bold py-2.5 rounded-xl hover:bg-orange-50 transition-colors">
                              View Booking Summary →
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ml-2.5 flex-shrink-0 mt-0.5">
                    <span className="text-xs text-gray-500 font-bold">U</span>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="msg-appear flex justify-start">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-2.5 flex-shrink-0">
                  <Compass size={15} className="text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md px-4 py-3.5 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="typing-dot w-2 h-2 bg-orange-400 rounded-full" />
                    <span className="typing-dot w-2 h-2 bg-orange-400 rounded-full" />
                    <span className="typing-dot w-2 h-2 bg-orange-400 rounded-full" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Input Bar ── */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 md:px-6 py-3">
            <div className="flex gap-2 items-center max-w-3xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={
                  step === "destinations"
                    ? "Or type a destination you have in mind..."
                    : step === "booking"
                    ? "Ask me anything about your trip..."
                    : "Add more context or ask a question..."
                }
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 flex-shrink-0 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Send size={15} />
              </button>
            </div>
            <p className="text-center text-gray-300 text-[10px] mt-2">
              SmartTrip AI · Suggestions are AI-generated · Always verify before booking
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SmartTripPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="flex gap-1.5">
          <span className="typing-dot w-2.5 h-2.5 bg-orange-400 rounded-full" />
          <span className="typing-dot w-2.5 h-2.5 bg-orange-400 rounded-full" />
          <span className="typing-dot w-2.5 h-2.5 bg-orange-400 rounded-full" />
        </div>
      </div>
    }>
      <SmartTripChat />
    </Suspense>
  );
}
