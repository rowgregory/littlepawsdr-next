import { RESCUE_GROUPS_BASE_URL } from "@public/static-data/paths";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  fetchDataFromApi,
  getPicturesAndVideos,
} from "app/utils/rescueGroupsHelpers";

export const rescueGroupsApi = createApi({
  reducerPath: "rescueGroupsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: RESCUE_GROUPS_BASE_URL,
    prepareHeaders: (headers) => {
      (headers as Headers).set(
        "Authorization",
        `${process.env.NEXT_PUBLIC_RESCUE_GROUPS_API_KEY}`
      );
      (headers as Headers).set("Content-Type", "application/vnd.api+json");
      (headers as Headers).set("Accept", "application/vnd.api+json");
      return headers;
    },
  }),
  endpoints: (builder: any) => ({
    getDachshundById: builder.query({
      query: (id: string) => `/animals/${id}`,
      transformResponse: (response: { data: { data: [] } }) => {
        if (response?.data) {
          getPicturesAndVideos(response);
        }

        return response;
      },
    }),
    getTotalDachshundCount: builder.query({
      queryFn: async (_: any, __: any, ___: any, baseQuery: any) => {
        const response = await fetchDataFromApi(baseQuery);

        const countDachshunds = (dataStructure: any) =>
          dataStructure.reduce(
            (total: any, record: any) => total + record?.data?.data?.length,
            0
          );

        const total = countDachshunds(response);

        return { data: { dachshundCount: total } };
      },
    }),
    getDachshundsByStatus: builder.mutation({
      query: ({
        status,
        pageLimit,
        currentPage,
      }: {
        status: string;
        pageLimit: number;
        currentPage: number;
      }) => {
        return {
          url: `/animals/search/dogs?limit=${pageLimit}&page=${currentPage}`,
          method: "POST",
          body: {
            data: {
              filters: [
                {
                  fieldName: "statuses.name",
                  operation: "equals",
                  criteria: status,
                },
              ],
            },
          },
        };
      },
      transformResponse: (response: { data: { data: [] } }) => {
        if (response?.data) {
          getPicturesAndVideos(response);
        }
        return response;
      },
    }),
  }),
}) as any;

export const {
  useGetDachshundByIdQuery,
  useGetTotalDachshundCountQuery,
  useGetDachshundsByStatusMutation,
} = rescueGroupsApi;
