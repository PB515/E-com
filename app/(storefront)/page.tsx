import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import CollectionRails from "@/components/home/CollectionRails";
import FeaturedPieces from "@/components/home/FeaturedPieces";
import HeritageStrip from "@/components/home/HeritageStrip";
import TrustStrip from "@/components/home/TrustStrip";
import InstagramSection from "@/components/home/InstagramSection";
import NewsletterBand from "@/components/site/NewsletterBand";
import { getHomeContent } from "@/lib/site-content";

// Home — section order per doc 03b. Dynamic because the featured rail + the
// admin-curated collection rails + the editable content all read live from DB.
export const dynamic = "force-dynamic";

export default async function Home() {
  const c = await getHomeContent();
  return (
    <>
      <Hero
        title={c.heroTitle}
        subtitle={c.heroSubtitle}
        cta1Label={c.heroCta1Label}
        cta1Href={c.heroCta1Href}
        cta2Label={c.heroCta2Label}
        cta2Href={c.heroCta2Href}
        imageUrl={c.heroImageUrl}
      />
      <CategoryGrid title={c.categoryTitle} />
      <CollectionRails />
      <FeaturedPieces title={c.featuredTitle} />
      <HeritageStrip />
      <InstagramSection />
      <TrustStrip items={c.trust} />
      <NewsletterBand title={c.newsletterTitle} subtitle={c.newsletterSubtitle} />
    </>
  );
}
