import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart } from "../store/authSlice";
export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const d = useDispatch();
  const nav = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const submit = (e) => {
    e.preventDefault();
    d(loginStart(form));
  };
  const user = useSelector((s) => s.auth.user);
  if (user) nav("/");
  return (
    <div className="container-page flex min-h-[calc(100vh-80px)] items-center justify-center py-10">
      <form onSubmit={submit} className="card w-full max-w-md p-7 sm:p-9">
        <p className="font-bold text-brand-500">WELCOME BACK</p>
        <h1 className="mt-2 text-3xl font-black">Sign in to BusNova</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your trips and book your next seat.
        </p>
        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="mt-7 space-y-4">
          <input
            className="input"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="btn-primary mt-5 w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <div className="mt-5 flex justify-between text-sm">
          <Link className="font-bold text-brand-500" to="/register">
            Create account
          </Link>
          <Link className="font-bold text-brand-500" to="/forgot-password">
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
}
