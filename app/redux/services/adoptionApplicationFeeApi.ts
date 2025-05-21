import { api } from "./api";

const BASE_URL = "/adopt";

export const adoptionApplicationFeeApi = api.injectEndpoints({
  endpoints: (build: any) => ({
    getAdoptionApplicationFees: build.query({
      query: () => BASE_URL,
      providesTags: ["Adoption-Application-Fee"],
    }),
    createAdoptionApplicationFeePayment: build.mutation({
      query: (fee: any) => ({
        url: `${BASE_URL}/post/endpoint=ADOPTION_APPLICATION_PAYMENT`,
        method: "POST",
        body: fee,
      }),
      invalidatesTags: ["Adoption-Application-Fee"],
    }),
    checkIfUserHasActiveAdoptionFeeSession: build.mutation({
      query: (product: any) => ({
        url: `${BASE_URL}/post?endpoint=CHECK_ACTIVE_ADOTION_APPLICATION_FEE_SESSION`,
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Adoption-Application-Fee"],
    }),
    jwtCheckValidityAdoptionFee: build.mutation({
      query: (token: any) => ({
        url: `${BASE_URL}/check-jwt-validity`,
        method: "POST",
        body: token,
      }),
      invalidatesTags: ["Adoption-Application-Fee"],
    }),
    updateAdoptionApplicationFee: build.mutation({
      query: (id: any) => ({
        url: `${BASE_URL}/expired`,
        method: "PATCH",
        body: id,
      }),
      invalidatesTags: ["User", "Adoption-Application-Fee"],
    }),
  }),
});

export const {
  useGetAdoptionApplicationFeesQuery,
  useCreateAdoptionApplicationFeePaymentMutation,
  useCheckIfUserHasActiveAdoptionFeeSessionMutation,
  useJwtCheckValidityAdoptionFeeMutation,
  useUpdateAdoptionApplicationFeeMutation,
} = adoptionApplicationFeeApi;
