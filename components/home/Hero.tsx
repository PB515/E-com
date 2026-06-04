import Button from "@/components/ui/Button";
import ImageSlot from "@/components/ui/ImageSlot";
import Reveal from "@/components/site/Reveal";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-16">
      <Reveal trigger="mount">
        <h1 className="font-heading text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
          Traditional ornament,
          <br />
          styled to wear today.
        </h1>
        <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-ink-muted lg:text-lg">
          Oxidised, antique-finish jewellery. Each piece tied to its motif, its
          region, and the occasion it belongs to.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button href="/shop">Shop the collection</Button>
          <Button href="/our-roots" variant="secondary">
            Our roots
          </Button>
        </div>
      </Reveal>

      <Reveal trigger="mount" delay={0.12}>
        <ImageSlot
          label="Hero photography"
          className="aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[4/5]"
        />
      </Reveal>
    </section>
  );
}
