import { combineReducers } from "@reduxjs/toolkit";
import { globalState } from "./app-state/global-state";
import ApiServices from "@/store/api-service";
import { dashboardSlice } from "./app-state/dashboard-slice";
import sessionSlice from "./app-state/session-slice";
import metadataSlice from "./app-state/metadata-slice";
import { visitorStatsSlice } from "./app-state/visitor-slice";
import sessionActivitySlice from "./app-state/session-activity-slice";

const rootReducer = combineReducers({
  account: globalState.reducer,
  dashboard: dashboardSlice.reducer,
  session: sessionSlice.reducer,
  metadata: metadataSlice.reducer,
  visitor: visitorStatsSlice.reducer,
  session_activity: sessionActivitySlice.reducer,
  [ApiServices.reducerPath]: ApiServices.reducer,
});

export default rootReducer;
