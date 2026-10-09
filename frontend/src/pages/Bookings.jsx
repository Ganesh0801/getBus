import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
export default function Bookings() {
  const d = useDispatch();
  const { myBookings } = useSelector((s) => s.booking);
  useEffect(() => {
    d({ type: "booking/loadMyBookings" });
  }, []);
  return (
    <div className="container-page py-10">
      <h1 className="section-title">My tickets</h1>
      <div className="mt-7 space-y-4">
        {myBookings.length ? (
          myBookings.map((b) => (
            <div className="card p-6" key={b._id}>
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-brand-500">
                    PNR {b.pnr}
                  </p>
                  <h3 className="mt-1 text-xl font-black">
                    {b.bus?.from} → {b.bus?.to}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {b.travelDate} · Seats {b.seats.join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <b>₹{b.totalFare}</b>
                  <p className="text-xs text-green-600">Confirmed</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-10 text-center">
            <h3 className="text-xl font-black">No bookings yet</h3>
            <Link className="btn-primary mt-5" to="/">
              Find a bus
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
