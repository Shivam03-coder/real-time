// store/slices/alertSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AlertLevel = "info" | "warning" | "milestone";

interface FilterState {
  country?: string;
  page: string;
}

const initialState: FilterState = {
  country: "",
  page: "",
};

export const filterSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<FilterState>) {
      state.country = action.payload.country;
      state.page = action.payload.page;
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice;
