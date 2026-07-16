'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error using a telemetry interface or track internally
    // (avoiding console.log per project rules)
    const payload = {
      event: 'uncaught_boundary_error',
      message: error?.message || 'Unknown rendering error',
      digest: error?.digest,
      timestamp: new Date().toISOString(),
    };
    try {
      const customEvent = new CustomEvent('restaurant_analytics', { detail: payload });
      window.dispatchEvent(customEvent);
    } catch {
      // Fail silently
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <span className="text-2xl text-red-500">⚠️</span>
      </div>
      <h2 className="text-2xl font-serif tracking-wide text-white">Something Went Wrong</h2>
      <p className="mt-2 text-sm text-neutral-400 max-w-sm leading-relaxed">
        Our digital salon is experiencing a minor disturbance. Let us restore the atmosphere for
        you.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-full px-8 py-3.5 transition-all duration-200"
        >
          Try Again
        </button>
        <button
          onClick={() => (window.location.href = '/')}
          className="border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white font-semibold text-xs rounded-full px-8 py-3.5 transition-all duration-200"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
