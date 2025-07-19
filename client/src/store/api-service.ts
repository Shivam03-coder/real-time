import { useUserLogoutMutation } from "@/apis/auth-api";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  credentials: "include",
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "GET",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      await baseQuery(
        {
          url: "/auth/logout",
          method: "POST",
        },
        api,
        extraOptions,
      );
    }
  }

  return result;
};

const ApiServices = createApi({
  reducerPath: "apiservices",
  baseQuery: baseQueryWithReAuth,
  tagTypes: [""],
  endpoints: (build) => ({}),
});

export default ApiServices;
