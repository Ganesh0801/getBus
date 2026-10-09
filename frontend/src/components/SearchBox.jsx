import { useState } from "react";
import { Search, MapPin, CalendarDays } from "lucide-react";
import { useDispatch } from "react-redux";
import { searchBusesStart } from "../store/busSlice";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const [form, setForm] = useState({
    from: "",
    to: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();

    if (!form.from || !form.to || !form.date) return;

    dispatch(searchBusesStart(form));

    navigate(`/buses?${new URLSearchParams(form)}`);
  };

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 rounded-[28px] bg-white p-3 shadow-2xl shadow-brand-900/15 sm:grid-cols-[1fr_1fr_1fr_auto]"
    >
      {/* FROM */}
      <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
        <MapPin className="text-brand-500" size={20} />

        <div className="w-full">
          <small className="block text-slate-400">From</small>

          <input
            required
            type="text"
            className="w-full bg-transparent font-bold text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Chennai"
            value={form.from}
            onChange={(e) =>
              setForm({
                ...form,
                from: e.target.value,
              })
            }
          />
        </div>
      </label>

      {/* TO */}
      <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
        <MapPin className="text-violet" size={20} />

        <div className="w-full">
          <small className="block text-slate-400">To</small>

          <input
            required
            type="text"
            className="w-full bg-transparent font-bold text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Bangalore"
            value={form.to}
            onChange={(e) =>
              setForm({
                ...form,
                to: e.target.value,
              })
            }
          />
        </div>
      </label>

      {/* DATE */}
      <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
        <CalendarDays className="text-brand-500" size={20} />

        <div>
          <small className="block text-slate-400">Travel date</small>

          <input
            required
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            className="bg-transparent font-bold text-slate-900 outline-none"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
          />
        </div>
      </label>

      {/* SEARCH BUTTON */}
      <button type="submit" className="btn-primary min-h-14 gap-2">
        <Search size={19} />
        Search
      </button>
    </form>
  );
}
