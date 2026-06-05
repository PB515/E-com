import Button from "@/components/ui/Button";
import ImageSlot from "@/components/ui/ImageSlot";
import Reveal from "@/components/site/Reveal";
import { HOME_DEFAULTS } from "@/lib/site-content";

export default function Hero({
  title = HOME_DEFAULTS.heroTitle,
  subtitle = HOME_DEFAULTS.heroSubtitle,
  cta1Label = HOME_DEFAULTS.heroCta1Label,
  cta1Href = HOME_DEFAULTS.heroCta1Href,
  cta2Label = HOME_DEFAULTS.heroCta2Label,
  cta2Href = HOME_DEFAULTS.heroCta2Href,
  imageUrl = "",
}: {
  title?: string;
  subtitle?: string;
  cta1Label?: string;
  cta1Href?: string;
  cta2Label?: string;
  cta2Href?: string;
  imageUrl?: string;
}) {
  return (
    <section className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-16">
      <Reveal trigger="mount">
        <h1 className="whitespace-pre-line font-heading text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-ink-muted lg:text-lg">
          {subtitle}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          {cta1Label ? <Button href={cta1Href}>{cta1Label}</Button> : null}
          {cta2Label ? (
            <Button href={cta2Href} variant="secondary">
              {cta2Label}
            </Button>
          ) : null}
        </div>
      </Reveal>

      <Reveal trigger="mount" delay={0.12}>
        <ImageSlot
          label="Hero photography"
          src={imageUrl || undefined}
          alt="Bugadi.co"
          className="aspect-[4/5] w-full sm:aspect-[16/11] lg:aspect-[4/5]"
        />
      </Reveal>
    </section>
  );
}
