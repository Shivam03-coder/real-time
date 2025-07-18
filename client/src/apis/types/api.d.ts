export interface ApiResponse {
  status: "success" | "failed" | "error";
  message: string;
}
