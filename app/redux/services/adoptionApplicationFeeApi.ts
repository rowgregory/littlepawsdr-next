import { api } from "./api";

const BASE_URL = "/adopt";

export const adoptionApplicationFeeApi = api.injectEndpoints({
  endpoints: (build: any) => ({
    fetchFees: build.query({
      query: () => BASE_URL,
      providesTags: ["Adoption-Application-Fee"],
    }),
    createPayment: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/payment`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Adoption-Application-Fee"],
    }),
    validateBypassCode: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/validate-bypasss-code`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Adoption-Application-Fee"],
    }),
  }),
});

export const {
  useFetchFeesQuery,
  useCreatePaymentMutation,
  useValidateBypassCodeMutation,
} = adoptionApplicationFeeApi;
