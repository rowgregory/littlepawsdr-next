import { api } from "./api";

const BASE_URL = "/user";

export const userApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build: any) => ({
    fetchUsers: build.query({
      query: () => `${BASE_URL}/fetch-users`,
      providesTags: ["User"],
    }),
    updateUser: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/update-user`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    userSystemStatus: build.query({
      query: () => `${BASE_URL}/system-status`,
      providesTags: ["User"],
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useUpdateUserMutation,
  useUserSystemStatusQuery,
} = userApi;
