import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { busDetailsStart } from "../store/busSlice";
import { loadSeatsStart, setPassengers } from "../store/bookingSlice";
import Seat from "../components/Seat";
import Spinner from "../components/Spinner";

export default function BusDetails() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const date = sp.get("date");
  const d = useDispatch();
  const nav = useNavigate();
  const { selected } = useSelector((s) => s.bus);
  const { seatMap } = useSelector((s) => s.booking);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [gender, setGender] = useState("Female");
  useEffect(() => {
    d(busDetailsStart(id));
    d(loadSeatsStart({ busId: id, date }));
  }, [id, date]);
  const selectedPassenger = useMemo(
    () =>
      selectedSeats.map((s) => ({
        seatNumber: s,
        name: "",
        age: "",
        gender: "",
      })),
    [selectedSeats],
  );
  if (!selected) return <Spinner />;
  const toggle = (s) => {
    if (s.occupied) return;
    setSelectedSeats((prev) =>
      prev.includes(s.number)
        ? prev.filter((x) => x !== s.number)
        : [...prev, s.number],
    );
  };
  const next = () => {
    if (!selectedSeats.length) return;
    d(setPassengers(selectedPassenger));
    nav(`/checkout?bus=${id}&date=${date}`);
  };
  return (
    <div className="container-page py-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <img
            src={selected.imageUrl}
            className="h-64 w-full rounded-3xl object-cover shadow-soft"
            alt={selected.name}
          />
          <div className="mt-5">
            <p className="font-bold text-brand-500">{selected.operator}</p>
            <h1 className="mt-1 text-4xl font-black">{selected.name}</h1>
            <p className="mt-3 text-slate-500">
              {selected.from} → {selected.to} · {selected.departure} →{" "}
              {selected.arrival}
            </p>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Choose your seats</h2>
            <span className="text-sm text-slate-500">
              {selectedSeats.length} selected
            </span>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              className={`btn ${gender === "Female" ? "bg-pink-500 text-white" : "bg-pink-50 text-pink-600"}`}
              onClick={() => setGender("Female")}
            >
              Female
            </button>
            <button
              className={`btn ${gender === "Male" ? "bg-brand-500 text-white" : "bg-slate-100"}`}
              onClick={() => setGender("Male")}
            >
              Male
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Female-seat safety rule: the booking service blocks a female
            passenger from being seated beside an occupied male passenger.
          </p>
          <div className="mx-auto mt-6 grid max-w-sm grid-cols-4 gap-3">
            {seatMap.map((s) => (
              <Seat
                key={s.number}
                seat={s}
                selected={selectedSeats.includes(s.number)}
                passengerGender={gender}
                onClick={() => toggle(s)}
              />
            ))}
          </div>
          <div className="mt-7 flex items-center justify-between border-t pt-5">
            <span className="text-slate-500">From ₹{selected.price}</span>
            <button className="btn-primary" onClick={next}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
