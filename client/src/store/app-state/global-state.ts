import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface InitialStateTypes {
  totalItemsInCart: number;
}

const initialState: InitialStateTypes = {
  totalItemsInCart: 0,
};

export const globalState = createSlice({
  name: "app-state",
  initialState,
  reducers: {
    setTotalItemsInCart: (state, action: PayloadAction<number>) => {
      state.totalItemsInCart = action.payload;
    },
  },
});

export const { setTotalItemsInCart } = globalState.actions;
export default globalState.reducer;
