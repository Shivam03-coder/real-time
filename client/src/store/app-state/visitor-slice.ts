import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface VisitorEvent {
  country: string;
  device: string;
  page: string;
  referrer: string;
  timestamp: string;
  type: string;
}

interface VisitorStatsState {
  stats: {
    totalActive: number;
    totalToday: number;
    pagesVisited: Record<string, number>;
  };
  event: VisitorEvent | null;
}

const initialState: VisitorStatsState = {
  stats: {
    totalActive: 0,
    totalToday: 0,
    pagesVisited: {},
  },
  event: null,
};

export const visitorStatsSlice = createSlice({
  name: "visitorStats",
  initialState,
  reducers: {
    setStats: (
      state,
      action: PayloadAction<VisitorStatsState>
    ) => {
      state.stats = action.payload.stats;
      state.event = action.payload.event;
    },
  },
});

export const { setStats } = visitorStatsSlice.actions;
export default visitorStatsSlice.reducer;
