import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckCircle2, Download } from "lucide-react";
export default function Confirmation() {
  const b = useSelector((s) => s.booking.confirmed);
  if (!b)
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-3xl font-black">No recent booking</h1>
      </div>
    );
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle2 size={64} className="mx-auto text-green-500" />
        <p className="mt-5 font-bold text-green-600">BOOKING CONFIRMED</p>
        <h1 className="mt-2 text-5xl font-black">You're all set.</h1>
        <p className="mt-4 text-slate-500">
          Your ticket has been emailed to you.
        </p>
      </div>
      <div className="card mx-auto mt-10 max-w-2xl p-7">
        <div className="flex justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400">PNR</p>
            <div className="text-3xl font-black text-brand-500">{b.pnr}</div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Amount paid</p>
            <b className="text-2xl">₹{b.totalFare}</b>
          </div>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <small>Route</small>
            <p className="font-black">
              {b.bus.from} → {b.bus.to}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <small>Date</small>
            <p className="font-black">{b.travelDate}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <small>Seats</small>
            <p className="font-black">{b.seats.join(", ")}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <small>Passengers</small>
            <p className="font-black">{b.passengers.length}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Link className="btn-primary flex-1" to="/bookings">
            My tickets
          </Link>
          <button className="btn-secondary">
            <Download size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
