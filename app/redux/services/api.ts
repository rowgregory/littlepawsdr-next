import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

// const fetchFn = async (
//   url: RequestInfo,
//   options?: RequestInit
// ): Promise<Response> => {
//   if (process.env.NODE_ENV !== "test") {
//     throw new Error("fetchFn should only be used in tests");
//   }
//   try {
//     const response = await fetch(url, options);
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response; // Return the response directly
//   } catch (error) {
//     console.error("Error in fetchFn:", error);
//     throw error; // Propagate error
//   }
// };

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api`,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
  // This ensures that cookies are included in
  // both the frontend and backend communication.
  credentials: "include",
  // cache: "no-store",
});

export const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 });

export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    "Auth",
    "Dashboard",
    "Order",
    "Dog-Boost",
    "Dog-Boost-Product",
    "Product",
    "User",
    "Newsletter-Email",
    "Cart",
    "Campaign",
    "Auction-Item",
    "Auction",
    "Item-Fulfillment",
    "Adopt-Fee",
    "Dachshund",
    "Stripe",
  ],
  endpoints: () => ({}),
}) as any;
