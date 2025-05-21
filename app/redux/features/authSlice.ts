import { Reducer, createSlice } from "@reduxjs/toolkit";
import { initialUserState } from "app/initial-states/user";
import { User } from "app/types/model.types";

export interface AuthStatePayload {
  loading: boolean;
  success: boolean;
  error: string | false | null;
  user: User;
  message: string | null;
  isAuthenticated: boolean | null;
  isAdmin: boolean | null;
  role: string;
  _id: string;
  firstName: string;
  lastName: string;
}

export const initialAuthState: AuthStatePayload = {
  loading: false,
  success: false,
  error: null,
  user: initialUserState,
  message: "",
  isAuthenticated: false,
  isAdmin: false,
  role: "supporter",
  _id: "",
  firstName: "",
  lastName: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    resetAuthSuccess: (state) => {
      state.success = false;
    },
    resetAuthError: (state) => {
      state.error = null;
      state.message = null;
    },
    setAuthState(state, { payload }) {
      state.isAuthenticated = payload.isAuthenticated;
      state._id = payload._id;
      state.role = payload.role;
      state.isAdmin = payload.isAdmin;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addMatcher(authApi.endpoints.login.matchFulfilled, (state: any, { payload }: any) => {
  //       state.user = payload;
  //     })
  //     .addMatcher(authApi.endpoints.register.matchFulfilled, (state: any, { payload }: any) => {
  //       state.message = payload.message;
  //     })
  //     .addMatcher(
  //       authApi.endpoints.updateAccountToConfirmed.matchFulfilled,
  //       (state: any, { payload }: any) => {
  //         state.isExpired = payload.isExpired;
  //         state.user = payload.user;
  //         state.message = payload.message;
  //         state.statusCode = payload.statusCode;
  //       }
  //     )
  //     .addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state: any, { payload }: any) => {
  //       state.refreshToken = payload.refreshToken;
  //     })
  //     .addMatcher(
  //       authApi.endpoints.forgotPasswordEmail.matchFulfilled,
  //       (state: any, { payload }: any) => {
  //         state.message = payload.message;
  //       }
  //     )
  //     .addMatcher(
  //       authApi.endpoints.validateForgotPasswordToken.matchFulfilled,
  //       (state: any, { payload }: any) => {
  //         state.message = payload.message;
  //         state.tokenIsValid = payload.tokenIsValid;
  //       }
  //     )
  //     .addMatcher(
  //       authApi.endpoints.resetPassword.matchFulfilled,
  //       (state: any, { payload }: any) => {
  //         state.message = payload.message;
  //         state.success = payload.success;
  //         state.tokenIsValid = payload.tokenIsValid;
  //       }
  //     )
  //     .addMatcher(authApi.endpoints.logout.matchFulfilled, (state: any, { payload }: any) => {
  //       state.message = payload.message;
  //     })
  //     .addMatcher(
  //       authApi.endpoints.validateCurrentPassword.matchFulfilled,
  //       (state, { payload }: any) => {
  //         state.message = payload.message;
  //         state.passwordsMatch = payload.passwordsMatch;
  //       }
  //     )
  //     .addMatcher(
  //       (action: any) =>
  //         action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'authApi',
  //       (state: any, action: any) => {
  //         state.loading = false;
  //         state.error = action.payload.data;
  //       }
  //     );
  // },
});

export const authReducer = authSlice.reducer as Reducer<AuthStatePayload>;

export const { resetAuthSuccess, resetAuthError, setAuthState } =
  authSlice.actions;
