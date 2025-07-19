import type { ApiResponse } from "./api";

export interface UserType extends ApiResponse {
  result: {
    id: string;
  };
}
