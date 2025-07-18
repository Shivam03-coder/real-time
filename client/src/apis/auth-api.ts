import ApiServices from "@/store/api-service";
import type { ApiResponse } from "./types/api";
import type { SignInSchemaType, SignUpSchemaType } from "@/schema/auth-schema";
import type { UserType } from "./types/auth";

const AuthServices = ApiServices.injectEndpoints({
  endpoints: (build) => ({
    SignUp: build.mutation<ApiResponse, SignUpSchemaType>({
      query: (userData) => ({
        url: "/auth/sign-up",
        method: "POST",
        body: userData,
      }),
    }),

    SignIn: build.mutation<UserType, SignInSchemaType>({
      query: (credentials) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: credentials,
      }),
    }),

    UserLogout: build.mutation<ApiResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    getUserInfo: build.query<UserType, void>({
      query: () => ({
        url: "/auth/userinfo",
        method: "GET",
      }),
      providesTags: ["UserInfo"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useUserLogoutMutation,
  useGetUserInfoQuery,
} = AuthServices;
