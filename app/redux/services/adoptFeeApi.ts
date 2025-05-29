import { api } from "./api";

const BASE_URL = "/adopt";

export const adoptFeeApi = api.injectEndpoints({
  endpoints: (build: any) => ({
    fetchAdoptFees: build.query({
      query: () => `${BASE_URL}/fetch-adopt-fees`,
      providesTags: ["Adopt-Fee"],
    }),
    validateBypassCode: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/validate-bypasss-code`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Adopt-Fee"],
    }),
  }),
});

export const { useFetchAdoptFeesQuery, useValidateBypassCodeMutation } =
  adoptFeeApi;
