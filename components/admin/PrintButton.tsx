"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-ink hover:bg-ink"
    >
      Print / Save as PDF
    </button>
  );
}
