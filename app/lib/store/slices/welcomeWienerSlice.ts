import { Reducer, createSlice } from '@reduxjs/toolkit'

interface WelcomeWienerStatePayload {
  loading: boolean
  success: boolean
  error: string | false | null
  message: string
  welcomeWieners: [] | any
  welcomeWiener: any
  welcomeWienerProducts: []
  welcomeWienerProduct: any
}

const initialWelcomeWienerState: WelcomeWienerStatePayload = {
  loading: false,
  success: false,
  error: null,
  message: '',
  welcomeWieners: [],
  welcomeWiener: {},
  welcomeWienerProducts: [],
  welcomeWienerProduct: {}
}

export const welcomeWienerSlice = createSlice({
  name: 'welcomeWiener',
  initialState: initialWelcomeWienerState,
  reducers: {
    resetWelcomeWienerError: (state) => {
      state.error = null
      state.message = null
    }
  }
})

export const welcomeWienerReducer = welcomeWienerSlice.reducer as Reducer<WelcomeWienerStatePayload>

export const { resetWelcomeWienerError } = welcomeWienerSlice.actions
