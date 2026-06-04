import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Reveal from "@/components/site/Reveal";

// Editorial statement band (a distinct layout family) — carries the killer
// feature (Wearable Heritage) onto the home page and links into Our Roots.
export default function HeritageStrip() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
      <Reveal trigger="view">
        <div className="rounded-3xl border border-border bg-surface px-8 py-16 lg:px-16 lg:py-20">
          <p className="max-w-3xl font-heading text-2xl leading-snug text-ink sm:text-3xl lg:text-4xl">
            Bugadi is itself a bugadi, a traditional ear ornament. Every piece
            carries its tradition: the motif it draws from, the region it belongs
            to, the occasion it was made for.
          </p>
          <Link
            href="/our-roots"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            Read our roots
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
