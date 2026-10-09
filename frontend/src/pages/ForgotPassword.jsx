import { useState } from "react";
import api from "../services/api";
export default function ForgotPassword() {
  const [email, setEmail] = useState(""),
    [otp, setOtp] = useState(""),
    [token, setToken] = useState(""),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [msg, setMsg] = useState("");
  const send = async () => {
    const { data } = await api.post("/auth/forgot-password/start", { email });
    setMsg(data.message);
  };
  const verify = async () => {
    const { data } = await api.post("/auth/forgot-password/verify", {
      email,
      otp,
    });
    setToken(data.resetToken);
    setMsg(data.message);
  };
  const reset = async () => {
    const { data } = await api.post("/auth/forgot-password/reset", {
      email,
      resetToken: token,
      password,
      confirmPassword: confirm,
    });
    setMsg(data.message);
  };
  return (
    <div className="container-page flex min-h-[calc(100vh-80px)] items-center justify-center py-10">
      <div className="card w-full max-w-md p-7">
        <p className="font-bold text-brand-500">ACCOUNT RECOVERY</p>
        <h1 className="mt-2 text-3xl font-black">Reset password</h1>
        <input
          className="input mt-6"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!token && (
          <button className="btn-primary mt-3 w-full" onClick={send}>
            Send OTP
          </button>
        )}
        {msg && <p className="mt-4 text-sm text-slate-500">{msg}</p>}
        {email && (
          <>
            <input
              className="input mt-4"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="btn-secondary mt-3 w-full" onClick={verify}>
              Verify OTP
            </button>
          </>
        )}
        {token && (
          <>
            <input
              className="input mt-4"
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="input mt-3"
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <button className="btn-primary mt-3 w-full" onClick={reset}>
              Reset password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
