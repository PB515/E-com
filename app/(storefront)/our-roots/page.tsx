import type { Metadata } from "next";
import Link from "next/link";
import ImageSlot from "@/components/ui/ImageSlot";
import Reveal from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "Our Roots",
  description:
    "The thinking behind Bugadi: traditional Indian ornament, the oxidised craft, and the motifs each piece carries.",
};

const vignettes = [
  { motif: "Paisley", region: "Rajasthan", line: "A teardrop read across the north as a sign of life and abundance." },
  { motif: "Temple bell", region: "South India", line: "The dome of the jhumka, borrowed from the bells of southern temples." },
  { motif: "Crescent", region: "Hyderabad", line: "The moon-shaped chandbali, carried out of the courts of the Deccan." },
  { motif: "Antique coin", region: "Tamil Nadu", line: "The kasu, strung as a mark of prosperity in the south." },
];

export default function OurRootsPage() {
  return (
    <>
      <section className="mx-auto max-w-[1000px] px-5 pt-16 sm:px-8 lg:pt-24">
        <Reveal trigger="mount">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-muted">Our roots</p>
          <h1 className="mt-5 max-w-3xl font-heading text-4xl leading-[1.1] text-ink lg:text-6xl">
            A bugadi is a traditional ear ornament. We named the store after one
            on purpose.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Bugadi sells traditional Indian ornament, styled to wear today. Not a
            generic trinket, but a piece tied to its motif, its region, and the
            occasion it belongs to. Each product page carries that story, because
            the story is half of what you are buying.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8 lg:py-20">
        <Reveal trigger="view">
          <h2 className="font-heading text-3xl text-ink">The craft</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
            Our pieces are made in German silver, an alloy of copper, zinc, and
            nickel that carries no precious metal but takes detail beautifully.
            The antique look comes from oxidising the surface, then bringing back
            the highlights so the raised work stands out against the darkened
            recesses. It is a finish, not a coating, and it is what gives the
            jewellery its weight of tradition.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 lg:pb-24">
        <h2 className="font-heading text-3xl text-ink">The motifs we carry</h2>
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
          {vignettes.map((v, i) => (
            <Reveal key={v.motif} trigger="view" delay={(i % 2) * 0.06}>
              <ImageSlot label={`${v.motif} motif`} className="aspect-[16/10] w-full" />
              <p className="mt-4 font-heading text-xl text-ink">
                {v.motif}, {v.region}
              </p>
              <p className="mt-1 text-ink-muted">{v.line}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8">
        <div className="rounded-3xl border border-border bg-surface px-8 py-14 text-center lg:py-16">
          <h2 className="font-heading text-3xl text-ink sm:text-4xl">
            Find a piece that carries your story
          </h2>
          <Link
            href="/shop"
            className="mt-7 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink transition-colors hover:bg-ink"
          >
            Shop the collection
          </Link>
        </div>
      </section>
    </>
  );
}
