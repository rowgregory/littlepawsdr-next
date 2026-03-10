import { createSlice } from '@reduxjs/toolkit'

interface UiState {
  confetti: boolean
  navigationDrawer: boolean
  isSpanish: boolean
  mobileNavigation: boolean
  isDark: boolean
}

const initialState: UiState = {
  confetti: false,
  navigationDrawer: false,
  isSpanish: false,
  mobileNavigation: false,
  isDark: false
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowConfetti: (state) => {
      state.confetti = true
    },
    setHideConfetti: (state) => {
      state.confetti = false
    },
    setOpenNavigationDrawer: (state) => {
      state.navigationDrawer = true
    },
    setCloseNavigationDrawer: (state) => {
      state.navigationDrawer = false
    },
    toggleNavigationDrawer: (state) => {
      state.navigationDrawer = !state.navigationDrawer
    },
    setIsSpanish: (state) => {
      state.isSpanish = true
    },
    setIsNotSpanish: (state) => {
      state.isSpanish = false
    },
    setOpenMobileNavigation: (state) => {
      state.mobileNavigation = true
    },
    setCloseMobileNavigation: (state) => {
      state.mobileNavigation = false
    },
    setIsDark: (state, { payload }) => {
      state.isDark = payload
    }
  }
})

export const {
  setShowConfetti,
  setHideConfetti,
  setCloseNavigationDrawer,
  setOpenNavigationDrawer,
  setIsNotSpanish,
  setIsSpanish,
  setCloseMobileNavigation,
  setOpenMobileNavigation,
  toggleNavigationDrawer,
  setIsDark
} = uiSlice.actions

export const uiReducer = uiSlice.reducer
