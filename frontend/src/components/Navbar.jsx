import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Ticket, LayoutDashboard } from "lucide-react";
import Logo from "./Logo";
import { logout } from "../store/authSlice";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <Link to="/" className="hover:text-brand-500">
            Home
          </Link>
          <Link to="/bookings" className="hover:text-brand-500">
            My Tickets
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-brand-500">
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:block text-sm font-semibold text-slate-700">
                @{user.username}
              </span>
              <button
                className="btn-secondary px-3"
                onClick={() => {
                  dispatch(logout());
                  navigate("/");
                }}
              >
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary px-4">
                Login
              </Link>
              <Link to="/register" className="btn-primary px-4">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
