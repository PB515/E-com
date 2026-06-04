"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="font-heading text-3xl text-ink">Something went wrong</h1>
      <p className="max-w-md text-ink-muted">
        A calm message, never an endless spinner (doc 10). Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-5 py-2 text-primary-ink transition-colors hover:bg-accent"
      >
        Try again
      </button>
    </main>
  );
}
