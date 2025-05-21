import { Reducer, createSlice } from '@reduxjs/toolkit';

interface NavbarStatePayload {
  loading: boolean;
  toggle: {
    navigationDrawer: boolean;
    bgColor: boolean;
    userDropdown: boolean;
    navbar: boolean;
  };
}

const initialNavbarState = {
  loading: false,
  toggle: {
    navigationDrawer: false,
    bgColor: false,
    userDropdown: false,
    navbar: false,
  },
};

export const navbarSlice = createSlice({
  name: 'navbar',
  initialState: initialNavbarState,
  reducers: {
    toggleNavigationDrawer: (state, { payload }) => {
      state.toggle.navigationDrawer = payload.navigationDrawer;
    },
    toggleBgColor: (state, { payload }) => {
      state.toggle.bgColor = payload.bgColor;
    },
    toggleUserDropdown: (state, { payload }) => {
      state.toggle.userDropdown = payload.userDropdown;
    },
    toggleNavbar: (state, { payload }) => {
      state.toggle.navbar = payload.navbar;
    },
  },
});

export const navbarReducer = navbarSlice.reducer as Reducer<NavbarStatePayload>;

export const {
  toggleNavigationDrawer,
  toggleBgColor,
  toggleUserDropdown,
  toggleNavbar,
} = navbarSlice.actions;
