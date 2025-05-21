import { Reducer, createSlice } from "@reduxjs/toolkit";
import { userApi } from "../services/userApi";

export interface UserStatePayload {
  loading: boolean;
  success: boolean;
  error: string | false | null;
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: any;
  updatedAt: string;
  status: string;
}

export const initialUserState: UserStatePayload = {
  loading: false,
  success: false,
  error: null,
  id: "",
  firstName: "",
  lastName: "",
  role: "",
  createdAt: "",
  updatedAt: "",
  status: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userApi.endpoints.fetchUsers.matchFulfilled,
        (state: any, { payload }: any) => {
          state.users = payload.users;
          state.loading = false;
        }
      )
      .addMatcher(userApi.endpoints.updateUser.matchFulfilled, (state: any) => {
        state.success = true;
      })
      .addMatcher(
        userApi.endpoints.userSystemStatus.matchFulfilled,
        (state: any, { payload }: any) => {
          state.message = payload.message;
          state.status = payload.status;
        }
      )
      .addMatcher(
        (action: any) =>
          action.type.endsWith("/rejected") &&
          action.payload?.data?.sliceName === "userApi",
        (state: any, action: any) => {
          state.loading = false;
          state.error = action.payload.data;
        }
      );
  },
});

export const userReducer = userSlice.reducer as Reducer<UserStatePayload>;

export const {} = userSlice.actions;
