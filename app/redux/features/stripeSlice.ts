import { stripeApi } from '@redux/services/stripeApi'
import { AnyAction, createSlice, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit'

interface StripeState {
  clientSecret: string | null
  loading: boolean
  error: string | null
  paymentIntentId: string | null
  confetti: boolean
}

const initialState: StripeState = {
  clientSecret: null,
  loading: false,
  error: null,
  paymentIntentId: null,
  confetti: false
}

const stripeSlice = createSlice({
  name: 'stripe',
  initialState,
  reducers: {
    setClientSecret(state, action: PayloadAction<string>) {
      state.clientSecret = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    reset(state) {
      state.clientSecret = null
      state.loading = false
      state.error = null
    },
    setShowConfetti: (state) => {
      state.confetti = true
    },
    setHideConfetti: (state) => {
      state.confetti = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.loading = true
        state.error = null
      })

      .addMatcher(isRejected, (state, action) => {
        state.loading = false
        state.error = action.error?.message ?? 'Unknown error'
      })

      .addMatcher(stripeApi.endpoints.createCheckout.matchFulfilled, (state: any, { payload }: any) => {
        state.paymentIntentId = payload.paymentIntentId
      })
  }
})

export const { setClientSecret, setLoading, setError, reset, setShowConfetti, setHideConfetti } = stripeSlice.actions

export const stripeReducer = stripeSlice.reducer
