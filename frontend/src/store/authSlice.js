import { createSlice } from "@reduxjs/toolkit";
const saved = localStorage.getItem("busnova_user");
const slice = createSlice({
  name: "auth",
  initialState: {
    user: saved ? JSON.parse(saved) : null,
    token: localStorage.getItem("busnova_token"),
    loading: false,
    error: null,
    step: "details",
    temp: {},
  },
  reducers: {
    registerStart(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.step = "verify";
      state.temp.email = action.payload.email;
    },
    registerSetPassword(state) {
      state.loading = true;
      state.error = null;
    },
    registrationComplete(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.step = "details";
    },
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("busnova_token");
      localStorage.removeItem("busnova_user");
    },
    authError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    forgotStart(state) {
      state.loading = true;
      state.error = null;
    },
    forgotSuccess(state, action) {
      state.loading = false;
      state.temp = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});
export const {
  registerStart,
  registerSuccess,
  registerSetPassword,
  registrationComplete,
  loginStart,
  loginSuccess,
  logout,
  authError,
  forgotStart,
  forgotSuccess,
  clearError,
} = slice.actions;
export default slice.reducer;
