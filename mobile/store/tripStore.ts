import { create } from "zustand";

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: "planning" | "booked" | "active" | "completed";
}

interface TripStore {
  trips: Trip[];
  activeTrip: Trip | null;
  addTrip: (trip: Trip) => void;
  setActiveTrip: (trip: Trip | null) => void;
}

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  activeTrip: null,
  addTrip: (trip) => set((s) => ({ trips: [...s.trips, trip] })),
  setActiveTrip: (trip) => set({ activeTrip: trip }),
}));
