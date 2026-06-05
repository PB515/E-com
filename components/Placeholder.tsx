/**
 * Phase-0 placeholder. Every scaffolded route renders this until its real
 * content lands in a later phase. Uses ONLY design tokens (no hardcoded hex).
 */
export default function Placeholder({
  title,
  note,
}: {
  title: string;
  note?: string;
}) {
  return (
    <main className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">Bugadi.co</p>
      <h1 className="font-heading text-3xl text-ink sm:text-4xl">{title}</h1>
      <p className="max-w-md text-ink-muted">
        {note ?? "Scaffolded route. Content arrives in a later phase."}
      </p>
    </main>
  );
}
