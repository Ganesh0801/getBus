import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import auth from "./store/authSlice";
import bus from "./store/busSlice";
import booking from "./store/bookingSlice";
import admin from "./store/adminSlice";
import rootSaga from "./sagas";

const saga = createSagaMiddleware();
export const store = configureStore({
  reducer: { auth, bus, booking, admin },
  middleware: (g) => g({ thunk: false }).concat(saga),
});
saga.run(rootSaga);
