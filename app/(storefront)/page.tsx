import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedPieces from "@/components/home/FeaturedPieces";
import HeritageStrip from "@/components/home/HeritageStrip";
import TrustStrip from "@/components/home/TrustStrip";
import NewsletterBand from "@/components/site/NewsletterBand";

// Home — section order per doc 03b. Each section is a distinct layout family
// (skill §4.7): split hero, asymmetric grid, horizontal rail, editorial band,
// hairline trust strip, centered CTA band.
export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedPieces />
      <HeritageStrip />
      <TrustStrip />
      <NewsletterBand />
    </>
  );
}
