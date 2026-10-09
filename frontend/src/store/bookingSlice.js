import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "booking",
  initialState: {
    seatMap: [],
    passengers: [],
    loading: false,
    payment: null,
    confirmed: null,
    myBookings: [],
    error: null,
  },
  reducers: {
    loadSeatsStart(state) {
      state.loading = true;
    },
    loadSeatsSuccess(state, action) {
      state.loading = false;
      state.seatMap = action.payload;
    },
    setPassengers(state, action) {
      state.passengers = action.payload;
    },
    paymentStart(state) {
      state.loading = true;
      state.error = null;
    },
    paymentOtpSent(state, action) {
      state.loading = false;
      state.payment = action.payload;
    },
    verifyPaymentStart(state) {
      state.loading = true;
    },
    paymentSuccess(state, action) {
      state.loading = false;
      state.confirmed = action.payload;
      state.payment = null;
    },
    bookingsSuccess(state, action) {
      state.myBookings = action.payload;
    },
    bookingError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
export const {
  loadSeatsStart,
  loadSeatsSuccess,
  setPassengers,
  paymentStart,
  paymentOtpSent,
  verifyPaymentStart,
  paymentSuccess,
  bookingsSuccess,
  bookingError,
} = slice.actions;
export default slice.reducer;
