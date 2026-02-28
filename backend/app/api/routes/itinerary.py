from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import json

from app.models.trip import ItineraryRequest, ItineraryResponse
from app.agents.itinerary_agent import generate_itinerary

router = APIRouter(prefix="/itinerary", tags=["itinerary"])


@router.post("/generate", response_model=ItineraryResponse, status_code=201)
async def create_itinerary(req: ItineraryRequest):
    """
    Generate an AI-powered day-by-day travel itinerary.

    - Calls Claude via ItineraryAgent
    - Returns structured JSON with activities, cost estimates, packing list,
      and ContentPilot shot suggestions for each activity
    """
    try:
        itinerary = await generate_itinerary(req)
        return itinerary
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"AI returned malformed JSON: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
