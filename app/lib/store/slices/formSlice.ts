import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const formInitialState = {
  isLoading: false,
  adoptFeeForm: { inputs: { subtotal: 15, totalPrice: 15 }, errors: {} },
  auctionItemForm: { inputs: { requiresShipping: false, showStartingPrice: true, sellingFormat: 'AUCTION' }, errors: {} },
  welcomeWienerForm: { inputs: { isLive: true }, errors: {} },
  checkoutForm: { inputs: { firstName: '', lastName: '', email: '' }, errors: {} },
  productForm: { inputs: { isLive: true }, errors: {} }
} as any

export const formSlice = createSlice({
  name: 'form',
  initialState: formInitialState,
  reducers: {
    setIsLoading: (state) => {
      state.isLoading = true
    },
    setIsNotLoading: (state) => {
      state.isLoading = false
    },
    resetForm: (state, { payload }) => {
      if (state[payload] && state[payload].inputs !== undefined) {
        state[payload].inputs = null
        state[payload].errors = null
      }
    },
    setInputs: (state, { payload }) => {
      const { formName, data } = payload
      if (!state[formName]) state[formName] = { inputs: {}, errors: {}, submitted: false }
      state[formName].inputs = { ...state[formName].inputs, ...data }
    },
    clearInputs: (state, { payload }: PayloadAction<{ formName: string }>) => {
      const { formName } = payload
      state[formName].inputs = {}
    },
    clearErrors: (state, { payload }: PayloadAction<{ formName: string }>) => {
      const { formName } = payload
      state[formName].errors = {}
    },
    setErrors: (state, { payload }) => {
      const { formName, errors } = payload
      if (!state[formName]) {
        return
      }

      state[formName].errors = errors
    },
    handleInput: (state, action) => {
      const { formName, name, value } = action.payload

      const form = state[formName]

      state[formName] = {
        ...form,
        inputs: {
          ...form?.inputs,
          [name]: value
        },
        errors: {
          ...form?.errors
        }
      }
    },
    handleToggle: (state, { payload }) => {
      const { formName, name, checked } = payload
      const form = state[formName]

      state[formName] = {
        ...form,
        inputs: {
          ...form?.inputs,
          [name]: checked
        },
        errors: {
          ...form?.errors
        }
      }
    },
    handleFileUpload: (state, { payload }) => {
      const { formName, imageUrl, file } = payload
      state[formName] = {
        ...state[formName],
        inputs: {
          ...state[formName]?.inputs,
          imageUrl,
          file
        }
      }
    },
    handleVideoUpload: (
      state,
      action: PayloadAction<{
        formName: string
        videoUrl: string | ArrayBuffer | null
        videoFile: File | null
      }>
    ) => {
      const { formName, videoUrl, videoFile } = action.payload
      state[formName] = {
        ...state[formName],
        inputs: {
          ...state[formName]?.inputs,
          videoUrl,
          videoFile
        }
      }
    },
    setUploadProgress: (state, { payload }: any) => {
      state.progress = payload
      if (state.progress === 100) {
        state.progress = -1
      }
    }
  }
})

export const { resetForm, setIsLoading, setIsNotLoading, setInputs, clearInputs, clearErrors } = formSlice.actions
export const formReducer = formSlice.reducer
