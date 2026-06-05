import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import CollectionRails from "@/components/home/CollectionRails";
import FeaturedPieces from "@/components/home/FeaturedPieces";
import HeritageStrip from "@/components/home/HeritageStrip";
import TrustStrip from "@/components/home/TrustStrip";
import NewsletterBand from "@/components/site/NewsletterBand";

// Home — section order per doc 03b. Dynamic because the featured rail + the
// admin-curated collection rails read live data from the database.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <CollectionRails />
      <FeaturedPieces />
      <HeritageStrip />
      <TrustStrip />
      <NewsletterBand />
    </>
  );
}
