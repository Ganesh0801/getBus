import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "bus",
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
    filters: {},
  },
  reducers: {
    searchBusesStart(state, action) {
      state.loading = true;
      state.error = null;
      state.filters = action.payload;
    },
    searchBusesSuccess(state, action) {
      state.loading = false;
      state.list = action.payload;
    },
    busDetailsStart(state) {
      state.loading = true;
    },
    busDetailsSuccess(state, action) {
      state.loading = false;
      state.selected = action.payload;
    },
    busError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
export const {
  searchBusesStart,
  searchBusesSuccess,
  busDetailsStart,
  busDetailsSuccess,
  busError,
} = slice.actions;
export default slice.reducer;
