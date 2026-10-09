import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchBusesStart } from "../store/busSlice";
import BusCard from "../components/BusCard";
import Spinner from "../components/Spinner";
export default function Buses() {
  const [sp] = useSearchParams();
  const d = useDispatch();
  const { list, loading } = useSelector((s) => s.bus);
  const [filters, setFilters] = useState({
    type: "All",
    seatType: "All",
    time: "",
    minPrice: "",
    maxPrice: "",
  });
  const base = {
    from: sp.get("from") || "",
    to: sp.get("to") || "",
    date: sp.get("date") || new Date().toISOString().slice(0, 10),
  };
  useEffect(() => {
    d(searchBusesStart({ ...base, ...filters }));
  }, [
    filters.from,
    filters.to,
    filters.date,
    filters.type,
    filters.seatType,
    filters.time,
    filters.minPrice,
    filters.maxPrice,
  ]);
  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-bold text-brand-500">AVAILABLE BUSES</p>
          <h1 className="section-title mt-1">
            {base.from} → {base.to}
          </h1>
          <p className="mt-2 text-slate-500">{base.date}</p>
        </div>
      </div>
      <div className="mt-8 grid gap-7 lg:grid-cols-[250px_1fr]">
        <aside className="card h-fit p-5">
          <h3 className="font-black">Filters</h3>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-semibold">
              Bus type
              <select
                className="input mt-2"
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
              >
                <option>All</option>
                <option>AC</option>
                <option>Non-AC</option>
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Seat type
              <select
                className="input mt-2"
                value={filters.seatType}
                onChange={(e) =>
                  setFilters({ ...filters, seatType: e.target.value })
                }
              >
                <option>All</option>
                <option>Seater</option>
                <option>Sleeper</option>
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Price range
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  className="input"
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                />
                <input
                  className="input"
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                />
              </div>
            </label>
            <label className="block text-sm font-semibold">
              Departure
              <select
                className="input mt-2"
                value={filters.time}
                onChange={(e) =>
                  setFilters({ ...filters, time: e.target.value })
                }
              >
                <option value="">Any time</option>
                <option value="before6">Before 6 AM</option>
                <option value="6to12">6 AM – 12 PM</option>
                <option value="12to18">12 PM – 6 PM</option>
                <option value="after18">After 6 PM</option>
              </select>
            </label>
          </div>
        </aside>
        <section className="space-y-4">
          {loading ? (
            <Spinner />
          ) : list.length ? (
            list.map((b) => <BusCard key={b._id} bus={b} date={base.date} />)
          ) : (
            <div className="card p-10 text-center">
              <h3 className="text-xl font-black">No buses found</h3>
              <p className="mt-2 text-slate-500">
                Try another route or relax one of the filters.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
