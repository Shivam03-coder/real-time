import ApiServices from "@/store/api-service";
import type { EventSummary, VisitorChartData } from "./types/event";

const AnalyticsServices = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    getSummary: build.query<EventSummary, null>({
      query: () => ({
        url: "/analytic/summary",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSummaryQuery } = AnalyticsServices;
