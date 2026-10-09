import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadAdminStatsStart,
  loadUsersStart,
  loadAdminBookingsStart,
} from "../../store/adminSlice";
import api from "../../services/api";
import { Users, Ticket, TrendingUp, Plus, Trash2 } from "lucide-react";

const emptyBus = {
  name: "",
  operator: "",
  from: "",
  to: "",
  departure: "",
  arrival: "",
  duration: "",
  price: "",
  offerPercent: 0,
  type: "AC",
  seatType: "Seater",
  totalSeats: 40,
  amenities: "WiFi, Charging",
  imageUrl: "",
};

export default function AdminDashboard() {
  const d = useDispatch();
  const { stats, users, bookings } = useSelector((s) => s.admin);
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState(emptyBus);
  const [open, setOpen] = useState(false);
  const refresh = async () => {
    const { data } = await api.get("/buses");
    setBuses(data.buses);
  };
  useEffect(() => {
    d(loadAdminStatsStart());
    d(loadUsersStart());
    d(loadAdminBookingsStart());
    refresh();
  }, []);
  const create = async (e) => {
    e.preventDefault();
    await api.post("/buses", {
      ...form,
      price: Number(form.price),
      offerPercent: Number(form.offerPercent),
      totalSeats: Number(form.totalSeats),
      amenities: form.amenities
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    });
    setForm(emptyBus);
    setOpen(false);
    refresh();
  };
  const remove = async (id) => {
    if (!confirm("Delete this bus?")) return;
    await api.delete(`/buses/${id}`);
    refresh();
  };
  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-bold text-brand-500">ADMIN CONSOLE</p>
          <h1 className="section-title mt-1">Business overview</h1>
        </div>
        <button className="btn-primary" onClick={() => setOpen(!open)}>
          <Plus size={18} />
          {open ? "Close" : "Add bus"}
        </button>
      </div>

      {open && (
        <form onSubmit={create} className="card mt-7 p-6">
          <h2 className="text-xl font-black">Add a bus</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["name", "Bus name"],
              ["operator", "Operator"],
              ["from", "From"],
              ["to", "To"],
              ["departure", "Departure (HH:MM)"],
              ["arrival", "Arrival (HH:MM)"],
              ["duration", "Duration"],
              ["price", "Price"],
              ["offerPercent", "Offer %"],
              ["totalSeats", "Total seats"],
              ["imageUrl", "Bus image URL"],
            ].map(([k, label]) => (
              <input
                key={k}
                required={[
                  "name",
                  "from",
                  "to",
                  "departure",
                  "arrival",
                  "price",
                ].includes(k)}
                className="input"
                placeholder={label}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            ))}
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>AC</option>
              <option>Non-AC</option>
            </select>
            <select
              className="input"
              value={form.seatType}
              onChange={(e) => setForm({ ...form, seatType: e.target.value })}
            >
              <option>Seater</option>
              <option>Sleeper</option>
              <option>Seater/Sleeper</option>
            </select>
            <input
              className="input md:col-span-2"
              placeholder="Amenities, comma separated"
              value={form.amenities}
              onChange={(e) => setForm({ ...form, amenities: e.target.value })}
            />
          </div>
          <button className="btn-primary mt-5">Save bus</button>
        </form>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          [Users, "Users", stats?.totalUsers || 0],
          [Ticket, "Bookings", stats?.totalBookings || 0],
          [
            TrendingUp,
            "Latest revenue",
            `₹${stats?.months?.at(-1)?.revenue || 0}`,
          ],
        ].map(([I, t, v]) => (
          <div className="card p-6" key={t}>
            <I className="text-brand-500" />
            <p className="mt-5 text-sm text-slate-500">{t}</p>
            <b className="text-3xl">{v}</b>
          </div>
        ))}
      </div>

      <div className="card mt-7 p-6">
        <h2 className="text-xl font-black">Revenue / expense / profit</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-6">
          {stats?.months?.map((m) => (
            <div
              key={`${m.year}-${m.month}`}
              className="rounded-2xl bg-slate-50 p-4"
            >
              <b>{m.label}</b>
              <div className="mt-3 text-xs text-slate-500">Revenue</div>
              <div className="font-black text-brand-500">₹{m.revenue}</div>
              <div className="mt-2 text-xs text-slate-500">Expense</div>
              <div className="font-bold">₹{m.expenses}</div>
              <div className="mt-2 text-xs text-slate-500">Profit</div>
              <div className="font-bold text-green-600">₹{m.profit}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-7 overflow-hidden">
        <div className="border-b p-5">
          <h2 className="font-black">Bus inventory</h2>
        </div>
        <div className="divide-y">
          {buses.map((b) => (
            <div
              key={b._id}
              className="flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div className="flex items-center gap-4">
                <img
                  src={b.imageUrl}
                  className="h-14 w-20 rounded-xl object-cover"
                  alt=""
                />
                <div>
                  <b>{b.name}</b>
                  <p className="text-sm text-slate-500">
                    {b.from} → {b.to} · {b.departure} · ₹{b.price}
                  </p>
                </div>
              </div>
              <button
                className="btn-secondary text-red-500"
                onClick={() => remove(b._id)}
              >
                <Trash2 size={17} /> Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-7 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="border-b p-5">
            <h2 className="font-black">Users</h2>
          </div>
          <div className="max-h-96 overflow-auto">
            {users.map((u) => (
              <div key={u._id} className="border-b p-4">
                <b>{u.username}</b>
                <p className="text-sm text-slate-500">
                  {u.email} · {u.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="card overflow-hidden">
          <div className="border-b p-5">
            <h2 className="font-black">Latest bookings</h2>
          </div>
          <div className="max-h-96 overflow-auto">
            {bookings.slice(0, 12).map((b) => (
              <div key={b._id} className="border-b p-4">
                <b>{b.pnr}</b>
                <p className="text-sm text-slate-500">
                  {b.user?.username} · ₹{b.totalFare}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
