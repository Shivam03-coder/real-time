import authRouter from "./auth.routes";
import analyticsRouter from "./analytics.routes";
import eventRouter from "./event.routes";
export default [
  {
    path: "auth",
    router: authRouter,
  },

  {
    path: "event",
    router: eventRouter,
  },
  {
    path: "analytic",
    router: analyticsRouter,
  },
];
