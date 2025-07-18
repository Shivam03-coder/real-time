import type { ApiResponse } from "./api";

export interface UserType extends ApiResponse {
  result: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    favourite: number;
    cart: number;
    address: string;
    profileImage: string;
  };
}
