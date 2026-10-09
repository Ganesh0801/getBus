import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
export default function AdminLogin() {
  const [f, setF] = useState({ email: "", password: "" });
  const [e, setE] = useState("");
  const nav = useNavigate(),
    d = useDispatch();
  const submit = async (x) => {
    x.preventDefault();
    try {
      const { data } = await api.post("/admin/login", f);
      localStorage.setItem("busnova_token", data.token);
      localStorage.setItem("busnova_user", JSON.stringify(data.user));
      d(loginSuccess(data));
      nav("/admin");
    } catch (x) {
      setE(x.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="container-page flex min-h-[calc(100vh-80px)] items-center justify-center">
      <form onSubmit={submit} className="card w-full max-w-md p-8">
        <p className="font-bold text-brand-500">CONTROL CENTER</p>
        <h1 className="mt-2 text-3xl font-black">Admin login</h1>
        {e && <p className="mt-4 rounded-xl bg-red-50 p-3 text-red-600">{e}</p>}
        <div className="mt-6 space-y-3">
          <input
            className="input"
            type="email"
            placeholder="Admin email"
            onChange={(e) => setF({ ...f, email: e.target.value })}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            onChange={(e) => setF({ ...f, password: e.target.value })}
          />
        </div>
        <button className="btn-primary mt-5 w-full">Enter dashboard</button>
      </form>
    </div>
  );
}
