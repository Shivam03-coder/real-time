export type EventDataApi = {
  type: "page_view" | "click" | "session_end";
  page: string;
  sessionId: string;
  country: string;
  device: string;
  referrer: string;
};
