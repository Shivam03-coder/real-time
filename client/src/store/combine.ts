import { combineReducers } from "@reduxjs/toolkit";
import { globalState } from "./app-state/global-state";
import ApiServices from "@/store/api-service";
import { dashboardSlice } from "./app-state/dashboard-slice";
import sessionSlice from "./app-state/session-slice";
import metadataSlice from "./app-state/metadata-slice";

const rootReducer = combineReducers({
  account: globalState.reducer,
  dashboard: dashboardSlice.reducer,
  session: sessionSlice.reducer,
  metadata: metadataSlice.reducer,
  [ApiServices.reducerPath]: ApiServices.reducer,
});

export default rootReducer;
