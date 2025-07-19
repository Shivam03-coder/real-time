import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  connectedDashboards: number;
  socketIds: string[];
  updatedAt: string | null;
}

const initialState: DashboardState = {
  connectedDashboards: 0,
  socketIds: [],
  updatedAt: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardStatus: (
      state,
      action: PayloadAction<{
        socketIds: string[];
        totalConnected: number;
        updatedAt: string;
      }>,
    ) => {
      state.socketIds = action.payload.socketIds;
      state.connectedDashboards = action.payload.totalConnected;
      state.updatedAt = action.payload.updatedAt;
    },
  },
});

export const { setDashboardStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;
