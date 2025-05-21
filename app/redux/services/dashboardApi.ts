import { api } from "./api";

const BASE_URL = "/dashboard";

export const dashboardApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    fetchDashboardData: build.query({
      query: () => `${BASE_URL}/fetch-dashboard-data`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useFetchDashboardDataQuery } = dashboardApi;
