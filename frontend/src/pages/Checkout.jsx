import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { busDetailsStart } from "../store/busSlice";
import { paymentStart, verifyPaymentStart } from "../store/bookingSlice";
export default function Checkout() {
  const [sp] = useSearchParams();
  const busId = sp.get("bus"),
    date = sp.get("date");
  const d = useDispatch(),
    nav = useNavigate();
  const bus = useSelector((s) => s.bus.selected),
    booking = useSelector((s) => s.booking),
    auth = useSelector((s) => s.auth);
  const [passengers, setPassengers] = useState([
    { seatNumber: "", name: "", age: "", gender: "Female", relationship: "" },
  ]);
  const [coupon, setCoupon] = useState("FIRST10");
  const [otp, setOtp] = useState("");
  useEffect(() => {
    if (!bus) d(busDetailsStart(busId));
  }, [busId]);
  useEffect(() => {
    if (booking.passengers.length)
      setPassengers(booking.passengers.map((p) => ({ ...p })));
  }, [booking.passengers.length]);
  const afterBusOffer = bus
    ? passengers.length * bus.price * (1 - (bus.offerPercent || 0) / 100)
    : 0;
  const total = afterBusOffer * (auth.user?.hasBooked ? 1 : 0.9);
  const submit = (e) => {
    e.preventDefault();
    if (!bus) return;
    d(
      paymentStart({
        busId,
        travelDate: date,
        passengers,
        coupon: auth.user?.hasBooked ? "" : coupon,
      }),
    );
  };
  const verify = (e) => {
    e.preventDefault();
    d(verifyPaymentStart({ paymentToken: booking.payment.paymentToken, otp }));
  };
  if (booking.confirmed) {
    nav("/confirmation");
    return null;
  }
  return (
    <div className="container-page py-10">
      <div className="grid gap-7 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="space-y-5">
          <div className="card p-6">
            <p className="font-bold text-brand-500">PASSENGER DETAILS</p>
            <h1 className="mt-1 text-3xl font-black">Checkout</h1>
            <div className="mt-6 space-y-5">
              {passengers.map((p, i) => (
                <div key={i} className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-4 flex justify-between">
                    <b>Passenger {i + 1}</b>
                    <span className="text-sm text-slate-500">
                      Seat {p.seatNumber || "—"}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      className="input"
                      required
                      placeholder="Full name"
                      value={p.name}
                      onChange={(e) => {
                        const x = [...passengers];
                        x[i].name = e.target.value;
                        setPassengers(x);
                      }}
                    />
                    <input
                      className="input"
                      required
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Age"
                      value={p.age}
                      onChange={(e) => {
                        const x = [...passengers];
                        x[i].age = e.target.value;
                        setPassengers(x);
                      }}
                    />
                    <select
                      className="input"
                      value={p.gender}
                      onChange={(e) => {
                        const x = [...passengers];
                        x[i].gender = e.target.value;
                        setPassengers(x);
                      }}
                    >
                      <option>Female</option>
                      <option>Male</option>
                      <option>Other</option>
                    </select>
                    <select
                      className="input"
                      value={p.relationship}
                      onChange={(e) => {
                        const x = [...passengers];
                        x[i].relationship = e.target.value;
                        setPassengers(x);
                      }}
                    >
                      <option value="">Relationship (optional)</option>
                      <option>Self</option>
                      <option>Mother</option>
                      <option>Wife</option>
                      <option>Sister</option>
                      <option>Daughter</option>
                      <option>Friend</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-black">First booking offer</h3>
            <p className="mt-2 text-sm text-slate-500">
              Use <b>FIRST10</b> if this is your first booking for an extra 10%
              off.
            </p>
            <input
              className="input mt-4"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            />
          </div>
          {!booking.payment ? (
            <button className="btn-primary w-full py-4">
              Pay now • secure OTP verification
            </button>
          ) : (
            <div className="card p-6">
              <h3 className="text-xl font-black">Check your email</h3>
              <p className="mt-2 text-sm text-slate-500">
                We sent a payment OTP to {auth.user?.email}.
              </p>
              <input
                className="input mt-5 text-center text-xl tracking-[.4em]"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
              />
              <button
                type="button"
                onClick={verify}
                className="btn-primary mt-4 w-full"
              >
                Verify OTP & confirm booking
              </button>
            </div>
          )}
        </form>
        <aside className="card h-fit p-6 lg:sticky lg:top-28">
          <h3 className="font-black">Trip preview</h3>
          {bus && (
            <>
              <img
                src={bus.imageUrl}
                className="mt-4 h-32 w-full rounded-2xl object-cover"
                alt="bus"
              />
              <h4 className="mt-4 font-black">{bus.name}</h4>
              <p className="text-sm text-slate-500">
                {bus.from} → {bus.to}
              </p>
              <div className="my-5 space-y-3 border-y py-5 text-sm">
                <div className="flex justify-between">
                  <span>Passengers</span>
                  <b>{passengers.length}</b>
                </div>
                <div className="flex justify-between">
                  <span>Base fare</span>
                  <b>₹{Math.round(total)}</b>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>First trip</span>
                  <b>-10%</b>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <b>₹{Math.round(total)}</b>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
