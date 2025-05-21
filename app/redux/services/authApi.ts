import { api } from "./api";

const BASE_URL = "/auth";

export const authApi = api.injectEndpoints({
  endpoints: (build: any) => ({
    register: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/register`,
        method: "POST",
        body,
      }),
    }),
    updateAccountToConfirmed: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/update-account-to-confirmed`,
        method: "POST",
        body,
      }),
    }),
    login: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/login`,
        method: "POST",
        body,
      }),
    }),
    refreshToken: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/refresh-token`,
        method: "POST",
        body,
      }),
    }),
    forgotPasswordEmail: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/forgot-password`,
        method: "POST",
        body,
      }),
    }),
    validateForgotPasswordToken: build.query({
      query: (body: any) => ({
        url: `${BASE_URL}/validate-forgot-password-token/${body.token}`,
        method: "GET",
      }),
    }),
    resetPassword: build.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/reset-password`,
        method: "POST",
        body,
      }),
    }),
    logout: build.mutation({
      query: (user: any) => ({
        url: `${BASE_URL}/logout`,
        method: "PUT",
        body: user,
      }),
    }),
    validateCurrentPassword: build.mutation({
      query: (user: any) => ({
        url: `${BASE_URL}/oldpassword/${user.id}`,
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUpdateAccountToConfirmedMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordEmailMutation,
  useValidateForgotPasswordTokenQuery,
  useResetPasswordMutation,
  useValidateCurrentPasswordMutation,
} = authApi;
