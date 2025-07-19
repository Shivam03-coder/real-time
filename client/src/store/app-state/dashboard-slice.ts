import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  totalDashboards: number;
  connectedAt: string | null;
}

const initialState: DashboardState = {
  totalDashboards: 0,
  connectedAt: "",
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardStatus: (
      state,
      action: PayloadAction<{
        totalDashboards: number;
        connectedAt: string;
      }>,
    ) => {
      state.totalDashboards = action.payload.totalDashboards;
      state.connectedAt = action.payload.connectedAt;
    },
  },
});

export const { setDashboardStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;
