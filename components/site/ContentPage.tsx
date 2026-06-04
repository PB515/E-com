// Shared shell for content/policy pages (skill: consistent structure, generous
// reading width, no decorative tells). Body uses max-w prose width.
export default function ContentPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-[760px] px-5 py-16 sm:px-8 lg:py-24">
      <h1 className="font-heading text-4xl text-ink lg:text-5xl">{title}</h1>
      {intro ? (
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">{intro}</p>
      ) : null}
      <div className="mt-10 flex flex-col gap-8 text-ink-muted [&_h2]:text-ink [&_h2]:text-xl [&_p]:leading-relaxed [&_a]:text-primary [&_a:hover]:underline">
        {children}
      </div>
    </article>
  );
}
