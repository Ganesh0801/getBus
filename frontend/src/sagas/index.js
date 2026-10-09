import { all, call, put, takeLatest } from "redux-saga/effects";
import api from "../services/api";
import * as A from "../store/authSlice";
import * as B from "../store/busSlice";
import * as K from "../store/bookingSlice";
import * as D from "../store/adminSlice";

const err = (e) => e?.response?.data?.message || e.message || "Request failed";

function* registerStart({ payload }) {
  try {
    yield call(api.post, "/auth/register/start", payload);
    yield put(A.registerSuccess(payload));
  } catch (e) {
    yield put(A.authError(err(e)));
  }
}
function* login({ payload }) {
  try {
    const { data } = yield call(api.post, "/auth/login", payload);
    localStorage.setItem("busnova_token", data.token);
    localStorage.setItem("busnova_user", JSON.stringify(data.user));
    yield put(A.loginSuccess(data));
  } catch (e) {
    yield put(A.authError(err(e)));
  }
}
function* setPassword({ payload }) {
  try {
    const { data } = yield call(
      api.post,
      "/auth/register/set-password",
      payload,
    );
    localStorage.setItem("busnova_token", data.token);
    const user = {
      email: payload.email,
      username: payload.username,
      phone: payload.phone,
      hasBooked: false,
      role: "user",
    };
    localStorage.setItem("busnova_user", JSON.stringify(user));
    yield put(A.registrationComplete({ token: data.token, user }));
  } catch (e) {
    yield put(A.authError(err(e)));
  }
}
function* forgot({ payload }) {
  try {
    yield call(api.post, "/auth/forgot-password/start", payload);
    yield put(A.forgotSuccess(payload));
  } catch (e) {
    yield put(A.authError(err(e)));
  }
}
function* search({ payload }) {
  try {
    const { data } = yield call(api.get, "/buses", { params: payload });
    yield put(B.searchBusesSuccess(data.buses));
  } catch (e) {
    yield put(B.busError(err(e)));
  }
}
function* details({ payload }) {
  try {
    const { data } = yield call(api.get, `/buses/${payload}`);
    yield put(B.busDetailsSuccess(data));
  } catch (e) {
    yield put(B.busError(err(e)));
  }
}
function* seats({ payload }) {
  try {
    const { data } = yield call(
      api.get,
      `/bookings/seat-map/${payload.busId}`,
      { params: { date: payload.date } },
    );
    yield put(K.loadSeatsSuccess(data.seats));
  } catch (e) {
    yield put(K.bookingError(err(e)));
  }
}
function* payment({ payload }) {
  try {
    const { data } = yield call(api.post, "/bookings/payment/start", payload);
    yield put(K.paymentOtpSent(data));
  } catch (e) {
    yield put(K.bookingError(err(e)));
  }
}
function* verifyPayment({ payload }) {
  try {
    const { data } = yield call(api.post, "/bookings/payment/verify", payload);
    yield put(K.paymentSuccess(data.booking));
  } catch (e) {
    yield put(K.bookingError(err(e)));
  }
}
function* myBookings() {
  try {
    const { data } = yield call(api.get, "/bookings/my");
    yield put(K.bookingsSuccess(data));
  } catch (e) {
    yield put(K.bookingError(err(e)));
  }
}
function* adminStats() {
  try {
    const { data } = yield call(api.get, "/admin/stats");
    yield put(D.adminStatsSuccess(data));
  } catch (e) {
    yield put(D.adminError(err(e)));
  }
}
function* users() {
  try {
    const { data } = yield call(api.get, "/admin/users");
    yield put(D.usersSuccess(data));
  } catch (e) {
    yield put(D.adminError(err(e)));
  }
}
function* adminBookings() {
  try {
    const { data } = yield call(api.get, "/admin/bookings");
    yield put(D.adminBookingsSuccess(data));
  } catch (e) {
    yield put(D.adminError(err(e)));
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(A.registerStart.type, registerStart),
    takeLatest(A.loginStart.type, login),
    takeLatest(A.registerSetPassword.type, setPassword),
    takeLatest(A.forgotStart.type, forgot),
    takeLatest(B.searchBusesStart.type, search),
    takeLatest(B.busDetailsStart.type, details),
    takeLatest(K.loadSeatsStart.type, seats),
    takeLatest(K.paymentStart.type, payment),
    takeLatest(K.verifyPaymentStart.type, verifyPayment),
    takeLatest("booking/loadMyBookings", myBookings),
    takeLatest(D.loadAdminStatsStart.type, adminStats),
    takeLatest(D.loadUsersStart.type, users),
    takeLatest(D.loadAdminBookingsStart.type, adminBookings),
  ]);
}
