import ApiServices from "@/store/api-service";
import type { ApiResponse } from "./types/api";
import type { EventDataApi } from "./types/event";

const EventServices = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    createEvent: build.mutation<ApiResponse, EventDataApi>({
      query: (eventData) => ({
        url: "/event",
        method: "POST",
        body: eventData,
      }),
    }),
  }),
});

export const { useCreateEventMutation } = EventServices;
