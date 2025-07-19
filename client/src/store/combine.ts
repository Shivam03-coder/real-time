import { combineReducers } from "@reduxjs/toolkit";
import { globalState } from "./app-state/global-state";
import ApiServices from "@/store/api-service";
import { dashboardSlice } from "./app-state/dashboard-slice";

const rootReducer = combineReducers({
  account: globalState.reducer,
  dashboard: dashboardSlice.reducer,
  [ApiServices.reducerPath]: ApiServices.reducer,
});

export default rootReducer;
