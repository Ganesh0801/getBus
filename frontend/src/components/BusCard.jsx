import { Link } from "react-router-dom";
import { Clock3, Snowflake, Wifi, Armchair } from "lucide-react";
export default function BusCard({ bus, date }) {
  const fare = Math.round(bus.price * (1 - bus.offerPercent / 100));
  return (
    <div className="card overflow-hidden">
      <div className="grid lg:grid-cols-[260px_1fr]">
        <img
          src={bus.imageUrl}
          alt={bus.name}
          className="h-48 w-full object-cover lg:h-full"
        />
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-500">
                {bus.operator}
              </p>
              <h3 className="mt-1 text-xl font-black">{bus.name}</h3>
            </div>
            <div className="rounded-2xl bg-brand-50 px-3 py-2 text-right">
              <div className="text-xs text-slate-500">Starting</div>
              <b className="text-xl text-brand-500">₹{fare}</b>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600">
            <span>
              {bus.departure} → {bus.arrival}
            </span>
            <span>
              <Clock3 size={15} className="inline" /> {bus.duration}
            </span>
            <span>
              <Snowflake size={15} className="inline" /> {bus.type}
            </span>
            <span>
              <Armchair size={15} className="inline" /> {bus.seatType}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {bus.amenities?.slice(0, 4).map((a) => (
              <span
                key={a}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold"
              >
                {a}
              </span>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Link className="btn-primary" to={`/bus/${bus._id}?date=${date}`}>
              View seats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
