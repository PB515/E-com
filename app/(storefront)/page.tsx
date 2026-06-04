import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedPieces from "@/components/home/FeaturedPieces";
import HeritageStrip from "@/components/home/HeritageStrip";
import TrustStrip from "@/components/home/TrustStrip";
import NewsletterBand from "@/components/site/NewsletterBand";

// Home — section order per doc 03b. Dynamic because the featured rail reads
// live products from the database.
export const dynamic = "force-dynamic";

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
