// store/slices/alertSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AlertLevel = "info" | "warning" | "milestone";

interface AlertPayload {
  level: AlertLevel;
  message: string;
  details?: Record<string, any>;
  timestamp?: string;
}

interface AlertState {
  current: AlertPayload | null;
}

const initialState: AlertState = {
  current: null,
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<AlertPayload>) {
      state.current = {
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
    },
  },
});

export const { setAlert } = alertSlice.actions;
export default alertSlice.reducer;
