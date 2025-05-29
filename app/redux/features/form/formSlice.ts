import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HandleInputProps, SetErrorsProps, SetInputProps } from 'app/types/form-types'

const formInitialState = {
  adoptFeeForm: { inputs: { subtotal: 15, totalPrice: 15 }, errors: {} }
} as any

export const formSlice = createSlice({
  name: 'form',
  initialState: formInitialState,
  reducers: {
    setIsCreating: (state) => {
      state.isCreating = true
    },
    setIsNotCreating: (state) => {
      state.isCreating = false
    },
    resetForm: (state, { payload }) => {
      if (state[payload] && state[payload].inputs !== undefined) {
        state[payload].inputs = null
        state[payload].errors = null
      }
    },
    setInputs: (state, { payload }: PayloadAction<SetInputProps>) => {
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
    setErrors: (state, { payload }: PayloadAction<SetErrorsProps>) => {
      const { formName, errors } = payload
      if (!state[formName]) {
        return
      }

      state[formName].errors = errors
    },
    handleInput: (state, action: PayloadAction<HandleInputProps>) => {
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
    handleToggle: (state, { payload }: PayloadAction<{ formName: string; name: string; checked: boolean }>) => {
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
    handleFileUpload: (
      state,
      action: PayloadAction<{
        formName: string
        imageUrl: string | ArrayBuffer | null
        file: File | null
      }>
    ) => {
      const { formName, imageUrl, file } = action.payload
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
      if ((state.progress = 100)) {
        state.progress = -1
      }
    }
  }
})

export const { resetForm, setIsCreating, setIsNotCreating, setInputs, clearInputs, clearErrors } = formSlice.actions
export const formReducer = formSlice.reducer
