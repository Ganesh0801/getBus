export default function Spinner() {
  return (
    <div className="flex min-h-[30vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
    </div>
  );
}
