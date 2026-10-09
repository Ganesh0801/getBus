import SearchBox from "../components/SearchBox";
import {
  ShieldCheck,
  Headphones,
  BadgePercent,
  BusFront,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
const cities = [
  "Chennai",
  "Bangalore",
  "Coimbatore",
  "Madurai",
  "Trichy",
  "Pondicherry",
];
export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(142,45,226,.35),transparent_35%),radial-gradient(circle_at_80%_40%,rgba(74,0,224,.3),transparent_35%)]" />
        <div className="container-page relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold">
              SMARTER TRAVEL • BETTER SEATS • SIMPLE BOOKING
            </span>
            <h1 className="mt-7 text-5xl font-black tracking-tight sm:text-7xl">
              Your journey starts with the{" "}
              <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                right seat.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Find buses, choose your exact seat, unlock first-trip savings and
              receive your confirmed PNR straight to your inbox.
            </p>
          </div>
          <div className="mt-10">
            <SearchBox />
          </div>
        </div>
      </section>
      <section className="container-page -mt-1 py-14">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            [ShieldCheck, "Secure booking", "OTP verified account & payment"],
            [
              BadgePercent,
              "First trip offer",
              "Save 10% on your first booking",
            ],
            [BusFront, "Choose your seat", "Live seat availability"],
            [Headphones, "Travel support", "Clear trip information"],
          ].map(([I, t, d]) => (
            <div className="card p-5" key={t}>
              <I className="text-brand-500" />
              <h3 className="mt-4 font-black">{t}</h3>
              <p className="mt-1 text-sm text-slate-500">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container-page pb-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-bold text-brand-500">POPULAR ROUTES</p>
            <h2 className="section-title mt-2">Go where life takes you.</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.slice(0, 6).map((c, i) => (
            <Link
              key={c}
              to={`/buses?from=${encodeURIComponent(c)}&to=${encodeURIComponent(cities[(i + 1) % cities.length])}&date=${new Date().toISOString().slice(0, 10)}`}
              className="card group flex items-center justify-between p-5 hover:-translate-y-1"
            >
              <span>
                <b>{c}</b>
                <span className="mx-2 text-slate-300">→</span>
                <b>{cities[(i + 1) % cities.length]}</b>
              </span>
              <ArrowRight
                size={18}
                className="text-brand-500 transition group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
