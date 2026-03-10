import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface UserStatePayload {
  loading: boolean
  success: boolean
  error: string | false | null
  id: string
  firstName: string
  lastName: string
  role: string
  createdAt: any
  updatedAt: string
  status: string
  firstNameFirstInitial: string
  lastNameFirstInitial: string
}

export const initialUserState: UserStatePayload = {
  loading: false,
  success: false,
  error: null,
  id: '',
  firstName: '',
  lastName: '',
  role: '',
  createdAt: '',
  updatedAt: '',
  status: '',
  firstNameFirstInitial: '',
  lastNameFirstInitial: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {}
})

export const userReducer = userSlice.reducer as Reducer<UserStatePayload>

export const {} = userSlice.actions
