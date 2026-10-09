import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerStart, registerSetPassword } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
export default function Register() {
  const d = useDispatch(),
    nav = useNavigate();
  const { step, error, loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    username: "",
    phone: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [token, setToken] = useState("");
  const start = (e) => {
    e.preventDefault();
    d(registerStart(form));
  };
  const verify = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register/verify-email", {
        email: form.email,
        otp: form.otp,
      });
      setToken(data.verificationToken);
      window.history.replaceState({}, "", "/register?step=password");
    } catch (e) {
      alert(e.response?.data?.message || "OTP failed");
    }
  };
  const password = (e) => {
    e.preventDefault();
    d(registerSetPassword({ ...form, verificationToken: token }));
  };
  return (
    <div className="container-page flex min-h-[calc(100vh-80px)] items-center justify-center py-10">
      <div className="w-full max-w-xl">
        <div className="mb-7 text-center">
          <p className="font-bold text-brand-500">JOIN BUSNOVA</p>
          <h1 className="mt-2 text-4xl font-black">
            {step === "details"
              ? "Create your account"
              : step === "verify"
                ? "Verify your email"
                : "Set your password"}
          </h1>
        </div>
        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 p-3 text-red-600">
            {error}
          </div>
        )}
        {step === "details" && (
          <form onSubmit={start} className="card p-7 space-y-4">
            <input
              className="input"
              placeholder="Username"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              className="input"
              placeholder="Phone number"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              className="input"
              type="email"
              placeholder="Email address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <button className="btn-primary w-full">
              {loading ? "Sending OTP..." : "Continue with email verification"}
            </button>
          </form>
        )}
        {step === "verify" && !token && (
          <form onSubmit={verify} className="card p-7 space-y-4">
            <p className="text-slate-500">
              We sent a beautiful verification email to <b>{form.email}</b>.
            </p>
            <input
              className="input text-center text-2xl tracking-[.5em]"
              maxLength="6"
              placeholder="000000"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
            />
            <button className="btn-primary w-full">Verify email</button>
          </form>
        )}
        {(step === "password" || token) && (
          <form onSubmit={password} className="card p-7 space-y-4">
            <input
              className="input"
              type="password"
              placeholder="Password (8+ characters)"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <input
              className="input"
              type="password"
              placeholder="Confirm password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
            <button className="btn-primary w-full">
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
