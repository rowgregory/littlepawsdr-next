import { api } from "./api";

interface BuildProps {
  mutation: (arg0: {
    query: (formData: any) => { url: string; method: string; body: any };
  }) => any;
}

const BASE_URL = "/stripe";

export const stripeApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: BuildProps) => ({
    createCheckout: build.mutation({
      query: (formData) => ({
        url: `${BASE_URL}/checkout`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useCreateCheckoutMutation } = stripeApi;
