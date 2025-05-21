import { api } from "./api";

const BASE_URL_WELCOME_WIENER_DACHSHUND = "/welcome-wiener/dachshund";
// const BASE_URL_WELCOME_WIENER_PRODUCT = "/welcome-wiener-product";

export const welcomeWienerApi = api.injectEndpoints({
  endpoints: (build: any) => ({
    getWelcomeWieners: build.query({
      query: () =>
        `${BASE_URL_WELCOME_WIENER_DACHSHUND}/get?endpoint=FETCH_WELCOME_WIENERS`,
      providesTags: ["Welcome-Wiener"],
    }),
    // getWelcomeWiener: build.query({
    //   query: (id: string) => `${BASE_URL_WELCOME_WIENER}/${id}`,
    //   providesTags: (result: any, error: any, arg: any) => [{ type: 'Welcome-Wiener', id: arg }],
    // }),
    // createWelcomeWiener: build.mutation({
    //   query: (welcomeWiener: any) => ({
    //     url: BASE_URL_WELCOME_WIENER,
    //     method: 'POST',
    //     body: welcomeWiener,
    //   }),
    //   invalidatesTags: ['Welcome-Wiener'],
    // }),
    // updateWelcomeWiener: build.mutation({
    //   query: (welcomeWiener: any) => ({
    //     url: `${BASE_URL_WELCOME_WIENER}/${welcomeWiener.id}`,
    //     method: 'PUT',
    //     body: welcomeWiener,
    //   }),
    //   invalidatesTags: ['Welcome-Wiener'],
    // }),
    // deleteWelcomeWiener: build.mutation({
    //   query: (welcomeWiener: any) => ({
    //     url: `${BASE_URL_WELCOME_WIENER}/${welcomeWiener.id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Welcome-Wiener'],
    // }),
    // getWelcomeWienerProducts: build.query({
    //   query: () => BASE_URL_WELCOME_WIENER_PRODUCT,
    //   providesTags: ['Welcome-Wiener-Product'],
    // }),
    // getWelcomeWienerProduct: build.query({
    //   query: (id: string) => `${BASE_URL_WELCOME_WIENER_PRODUCT}/${id}`,
    //   providesTags: (result: any, error: any, arg: any) => [
    //     { type: 'Welcome-Wiener-Product', id: arg },
    //   ],
    // }),
    // createWelcomeWienerProduct: build.mutation({
    //   query: (welcomeWienerProduct: any) => ({
    //     url: BASE_URL_WELCOME_WIENER_PRODUCT,
    //     method: 'POST',
    //     body: welcomeWienerProduct,
    //   }),
    //   invalidatesTags: ['Welcome-Wiener-Product'],
    // }),
    // updateWelcomeWienerProduct: build.mutation({
    //   query: (welcomeWienerProduct: any) => ({
    //     url: `${BASE_URL_WELCOME_WIENER_PRODUCT}/${welcomeWienerProduct.id}`,
    //     method: 'PUT',
    //     body: welcomeWienerProduct,
    //   }),
    //   invalidatesTags: ['Welcome-Wiener', 'Welcome-Wiener-Product'],
    // }),
    // deleteWelcomeWienerProduct: build.mutation({
    //   query: (welcomeWienerProduct: any) => ({
    //     url: `${BASE_URL_WELCOME_WIENER_PRODUCT}/${welcomeWienerProduct.id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Welcome-Wiener-Product'],
    // }),
    // toggleLive: build.mutation({
    //   query: (welcomeWiener: any) => ({
    //     url: `${BASE_URL_WELCOME_WIENER}/toggle-live`,
    //     method: 'PUT',
    //     body: welcomeWiener,
    //   }),
    //   invalidatesTags: ['Welcome-Wiener'],
    // }),
  }),
});

export const {
  useGetWelcomeWienersQuery,
  // useGetWelcomeWienerQuery,
  // useCreateWelcomeWienerMutation,
  // useUpdateWelcomeWienerMutation,
  // useDeleteWelcomeWienerMutation,
  // useGetWelcomeWienerProductsQuery,
  // useGetWelcomeWienerProductQuery,
  // useCreateWelcomeWienerProductMutation,
  // useUpdateWelcomeWienerProductMutation,
  // useDeleteWelcomeWienerProductMutation,
  // useToggleLiveMutation,
} = welcomeWienerApi;
