export default function Seat({ seat, selected, passengerGender, onClick }) {
  const female = passengerGender === "Female";
  return (
    <button
      disabled={seat.occupied}
      onClick={onClick}
      title={seat.occupied ? "Booked" : "Available"}
      className={`h-11 w-11 rounded-xl border-2 text-xs font-bold transition ${
        seat.occupied
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300"
          : selected
            ? "border-brand-500 bg-brand-500 text-white scale-105"
            : female
              ? "border-pink-200 bg-pink-50 text-pink-600 hover:border-pink-500"
              : "border-slate-200 bg-white text-slate-700 hover:border-brand-500 hover:text-brand-500"
      }`}
    >
      {seat.number}
    </button>
  );
}
