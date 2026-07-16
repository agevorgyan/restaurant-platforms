import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
        <span className="text-2xl text-amber-500">🥂</span>
      </div>
      <h2 className="text-2xl font-serif tracking-wide text-white font-medium">Page Not Found</h2>
      <p className="mt-2 text-sm text-neutral-400 max-w-sm leading-relaxed">
        The table or menu selection you are looking for has been moved or does not exist in our salon.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-full px-8 py-3.5 transition-all duration-200 inline-block"
        >
          Return to Menu
        </Link>
      </div>
    </div>
  );
}
