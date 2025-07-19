// store/app-state/metadata-slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MetadataState {
  country: string | null;
  device: string | null;
  referrer: string | null;
  ipAddress: string | null;
}

const initialState: MetadataState = {
  country: null,
  device: null,
  referrer: null,
  ipAddress: null,
};

const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    setMetadata: (state, action: PayloadAction<MetadataState>) => {
      return { ...state, ...action.payload };
    },
    clearMetadata: () => initialState,
  },
});

export const { setMetadata, clearMetadata } = metadataSlice.actions;
export default metadataSlice;
