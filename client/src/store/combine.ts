import { combineReducers } from "@reduxjs/toolkit";
import { globalState } from "./app-state/global-state";
import ApiServices from "@/store/api-service";

const rootReducer = combineReducers({
  account: globalState.reducer,
  [ApiServices.reducerPath]: ApiServices.reducer,
});

export default rootReducer;
