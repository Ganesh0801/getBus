import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    users: [],
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    loadAdminStatsStart(state) {
      state.loading = true;
    },
    adminStatsSuccess(state, action) {
      state.loading = false;
      state.stats = action.payload;
    },
    loadUsersStart(state) {
      state.loading = true;
    },
    usersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
    },
    loadAdminBookingsStart(state) {
      state.loading = true;
    },
    adminBookingsSuccess(state, action) {
      state.loading = false;
      state.bookings = action.payload;
    },
    adminError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
export const {
  loadAdminStatsStart,
  adminStatsSuccess,
  loadUsersStart,
  usersSuccess,
  loadAdminBookingsStart,
  adminBookingsSuccess,
  adminError,
} = slice.actions;
export default slice.reducer;
