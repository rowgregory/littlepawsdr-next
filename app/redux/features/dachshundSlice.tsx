import { rescueGroupsApi } from '@redux/services/rescueGroupsApi'
import { Reducer, createSlice } from '@reduxjs/toolkit'
import { initialDachshundDetailsPayload } from 'app/initial-states/dachshund'
import { DachshundStatePayload } from 'app/types/api-types'

const initialDachshundState: DachshundStatePayload = {
  loading: false,
  success: false,
  error: null,
  message: '',
  dachshundCount: 0,
  available: [],
  allDogs: [] as any,
  dachshund: initialDachshundDetailsPayload,
  initialData: null,
  dachshunds: [],
  totalCount: 0
}

export const dachshundSlice = createSlice({
  name: 'dachshund',
  initialState: initialDachshundState,
  reducers: {
    resetDachshundError: (state) => {
      state.error = null
      state.message = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(rescueGroupsApi.endpoints.getDachshundById.matchFulfilled, (state, action: any) => {
        state.dachshund = action.payload.data[0]
      })
      .addMatcher(rescueGroupsApi.endpoints.getTotalDachshundCount.matchFulfilled, (state, action: any) => {
        state.totalCount = action.payload.dachshundCount
      })
      .addMatcher(rescueGroupsApi.endpoints.getDachshundsByStatus.matchFulfilled, (state, action: any) => {
        state.dachshunds = action.payload.data
      })
      .addMatcher(
        (action: any) => action.type.endsWith('/rejected') && action.payload?.data?.sliceName === 'dachshundApi',
        (state: any, { payload }: any) => {
          state.loading = false
          state.error = payload.data
        }
      )
  }
})

export const dachshundReducer = dachshundSlice.reducer as Reducer<DachshundStatePayload>

export const { resetDachshundError } = dachshundSlice.actions
