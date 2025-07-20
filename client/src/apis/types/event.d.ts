import type { extend } from "node_modules/zod/v4/core/util.d.cts";
import type { ApiResponse } from "./api";

export type EventDataApi = {
  type: "page_view" | "click" | "session_end";
  page: string;
  sessionId: string;
  country: string;
  device: string;
  referrer: string;
};

interface VisitorChartData extends ApiResponse {
  result: {
    minute: Date;
    count: number;
  }[];
}

interface EventSummary extends ApiResponse {
  result: {
    country: string;
    sessionId: string;
    device: string;
    type: string;
    page: string;
  }[];
}
