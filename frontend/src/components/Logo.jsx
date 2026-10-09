export default function Logo({ light = false }) {
  return (
    <img
      src="/logo.svg"
      alt="BusNova"
      className={`h-10 w-auto ${light ? "brightness-0 invert" : ""}`}
    />
  );
}
