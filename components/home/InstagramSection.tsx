import Image from "next/image";
import { InstagramLogo, VideoCamera, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getInstagramPosts } from "@/lib/instagram";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/site";
import Reveal from "@/components/site/Reveal";

// Admin-curated Instagram showcase. Privacy-friendly: thumbnail cards that open
// the post/reel on Instagram (no third-party embed script). Renders nothing
// until the admin adds posts.
export default async function InstagramSection() {
  const posts = await getInstagramPosts(8);
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl text-ink sm:text-4xl">From our Instagram</h2>
          <p className="mt-2 text-sm text-ink-muted">See the pieces styled and worn. {INSTAGRAM_HANDLE}</p>
        </div>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-ink transition-colors hover:bg-surface"
        >
          <InstagramLogo size={18} /> Follow
        </a>
      </div>

      <Reveal trigger="view">
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {posts.map((p) => (
            <li key={p.id}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-2xl border border-border bg-surface"
                aria-label={p.caption || (p.isReel ? "Instagram reel" : "Instagram post")}
              >
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.caption || "Instagram"}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                {/* hover veil + open icon */}
                <span className="absolute inset-0 flex items-center justify-center bg-bg/0 opacity-0 transition-opacity duration-300 group-hover:bg-bg/30 group-hover:opacity-100">
                  <ArrowUpRight size={26} className="text-ink" weight="bold" />
                </span>
                {p.isReel ? (
                  <span className="absolute right-2 top-2 rounded-full bg-bg/70 p-1.5 backdrop-blur">
                    <VideoCamera size={15} weight="fill" className="text-ink" />
                  </span>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
