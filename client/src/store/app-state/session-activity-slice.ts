import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type SessionData = {
  sessionId: string;
  currentPage: string;
  journey: string[];
  duration: number;
};

interface SessionActivityState {
  sessions: Record<string, SessionData>;
}

const initialState: SessionActivityState = {
  sessions: {},
};

const sessionActivitySlice = createSlice({
  name: "sessionActivity",
  initialState,
  reducers: {
    upsertSession: (state, action: PayloadAction<SessionData>) => {
      const session = action.payload;
      state.sessions[session.sessionId] = session;
    },
  },
});

export const { upsertSession } = sessionActivitySlice.actions;
export default sessionActivitySlice;
