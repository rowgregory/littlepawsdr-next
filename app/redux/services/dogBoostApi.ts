import { api } from "./api";

const BASE_URL_DOG_BOOST_DACHSHUND = "/dog-boost";
// const BASE_URL_DOG_BOOST_PRODUCT = "/dog-boost-product";

export const dogBoostApi = api.injectEndpoints({
  endpoints: (build: any) => ({
    getDogBoosts: build.query({
      query: () => `${BASE_URL_DOG_BOOST_DACHSHUND}/fetch-dog-boosts`,
      providesTags: ["Dog-Boost"],
    }),
    // getDogBoost: build.query({
    //   query: (id: string) => `${BASE_URL_DOG_BOOST}/${id}`,
    //   providesTags: (result: any, error: any, arg: any) => [{ type: 'Dog-Boost', id: arg }],
    // }),
    // createDogBoost: build.mutation({
    //   query: (DogBoost: any) => ({
    //     url: BASE_URL_DOG_BOOST,
    //     method: 'POST',
    //     body: DogBoost,
    //   }),
    //   invalidatesTags: ['Dog-Boost'],
    // }),
    // updateDogBoost: build.mutation({
    //   query: (DogBoost: any) => ({
    //     url: `${BASE_URL_DOG_BOOST}/${DogBoost.id}`,
    //     method: 'PUT',
    //     body: DogBoost,
    //   }),
    //   invalidatesTags: ['Dog-Boost'],
    // }),
    // deleteDogBoost: build.mutation({
    //   query: (DogBoost: any) => ({
    //     url: `${BASE_URL_DOG_BOOST}/${DogBoost.id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Dog-Boost'],
    // }),
    // getDogBoostProducts: build.query({
    //   query: () => BASE_URL_DOG_BOOST_PRODUCT,
    //   providesTags: ['Dog-Boost-Product'],
    // }),
    // getDogBoostProduct: build.query({
    //   query: (id: string) => `${BASE_URL_DOG_BOOST_PRODUCT}/${id}`,
    //   providesTags: (result: any, error: any, arg: any) => [
    //     { type: 'Dog-Boost-Product', id: arg },
    //   ],
    // }),
    // createDogBoostProduct: build.mutation({
    //   query: (DogBoostProduct: any) => ({
    //     url: BASE_URL_DOG_BOOST_PRODUCT,
    //     method: 'POST',
    //     body: DogBoostProduct,
    //   }),
    //   invalidatesTags: ['Dog-Boost-Product'],
    // }),
    // updateDogBoostProduct: build.mutation({
    //   query: (DogBoostProduct: any) => ({
    //     url: `${BASE_URL_DOG_BOOST_PRODUCT}/${DogBoostProduct.id}`,
    //     method: 'PUT',
    //     body: DogBoostProduct,
    //   }),
    //   invalidatesTags: ['Dog-Boost', 'Dog-Boost-Product'],
    // }),
    // deleteDogBoostProduct: build.mutation({
    //   query: (DogBoostProduct: any) => ({
    //     url: `${BASE_URL_DOG_BOOST_PRODUCT}/${DogBoostProduct.id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Dog-Boost-Product'],
    // }),
    // toggleLive: build.mutation({
    //   query: (DogBoost: any) => ({
    //     url: `${BASE_URL_DOG_BOOST}/toggle-live`,
    //     method: 'PUT',
    //     body: DogBoost,
    //   }),
    //   invalidatesTags: ['Dog-Boost'],
    // }),
  }),
});

export const {
  useGetDogBoostsQuery,
  // useGetDogBoostQuery,
  // useCreateDogBoostMutation,
  // useUpdateDogBoostMutation,
  // useDeleteDogBoostMutation,
  // useGetDogBoostProductsQuery,
  // useGetDogBoostProductQuery,
  // useCreateDogBoostProductMutation,
  // useUpdateDogBoostProductMutation,
  // useDeleteDogBoostProductMutation,
  // useToggleLiveMutation,
} = dogBoostApi;
