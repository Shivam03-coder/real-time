import ApiServices from "@/store/api-service";
import type { ApiResponse } from "./types/api";
import type { EventDataApi, VisitorChartData } from "./types/event";

const EventServices = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    createEvent: build.mutation<ApiResponse, EventDataApi>({
      query: (eventData) => ({
        url: "/event",
        method: "POST",
        body: eventData,
      }),
    }),
    getlast10minStats: build.query<VisitorChartData, void>({
      query: (eventData) => ({
        url: "/event/last10minStats",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateEventMutation, useGetlast10minStatsQuery } =
  EventServices;
