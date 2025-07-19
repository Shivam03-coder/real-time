// features/session/sessionSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface SessionState {
  tabSessionId: string | null;
}

const initialState: SessionState = {
  tabSessionId: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setTabSessionId: (state, action) => {
      state.tabSessionId = action.payload;
    },
    clearTabSessionId: (state) => {
      state.tabSessionId = null;
    },
  },
});

export const { setTabSessionId, clearTabSessionId } = sessionSlice.actions;
export default sessionSlice;