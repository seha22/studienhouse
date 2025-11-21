"use client";

import Image from "next/image";
import type { SyntheticEvent } from "react";
import { PopularCoursesContent } from "@/lib/landing-content";
import { SectionHeader } from "./SectionHeader";

type Props = {
  content: PopularCoursesContent;
};

const FALLBACK_IMAGE = "/images/course-fallback.jpg";

function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  // Swap to a local fallback if the remote image fails to load (e.g. 400s).
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMAGE;
}

const supabaseHostname = (() => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return undefined;
  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return undefined;
  }
})();

function shouldBypassOptimization(src: string) {
  if (!supabaseHostname) return false;
  try {
    const url = new URL(src);
    return url.hostname === supabaseHostname && url.pathname.includes("/storage/v1/object/public/landing/");
  } catch {
    return false;
  }
}

export function PopularCourses({ content }: Props) {
  return (
    <section className="container space-y-10 py-16">
      <SectionHeader {...content.header} />

      <div className="grid gap-8 lg:grid-cols-2">
        {content.featureCards.map((card) => (
          <div
            key={card.title}
            className={`flex flex-col gap-5 rounded-[2.75rem] ${card.color} p-6`}
          >
            {/*
              Images uploaded via the CMS (Supabase storage) can trigger Next.js image loader 400s.
              Mark those as unoptimized so they bypass the _next/image proxy.
            */}
            {(() => {
              const imageSrc = card.image || FALLBACK_IMAGE;
              const unoptimized = shouldBypassOptimization(imageSrc);
              return (
                <Image
                  src={imageSrc}
                  alt={card.title}
                  width={560}
                  height={320}
                  className="h-56 w-full rounded-[2rem] object-cover"
                  onError={handleImageError}
                  unoptimized={unoptimized}
                />
              );
            })()}
            <div className="space-y-2 text-charcoal">
              <h3 className="text-2xl font-semibold">{card.title}</h3>
              <p className="text-sm text-stone">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {content.sliderCards.map((item) => (
          <div
            key={item.title}
            className={`rounded-[2.5rem] ${item.bg} p-6 shadow-card`}
          >
            <div className="flex items-center justify-between text-sm text-muted">
              <span>{item.students}</span>
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-muted"
              />
              <span>Live</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              {(() => {
                const imageSrc = item.image || FALLBACK_IMAGE;
                const unoptimized = shouldBypassOptimization(imageSrc);
                return (
                  <Image
                    src={imageSrc}
                    alt={item.title}
                    width={120}
                    height={120}
                    className="h-24 w-24 rounded-2xl object-cover"
                    onError={handleImageError}
                    unoptimized={unoptimized}
                  />
                );
              })()}
              <div>
                <p className="text-lg font-semibold text-charcoal">{item.title}</p>
                <p className="text-sm text-stone">{item.subtitle}</p>
              </div>
            </div>
            <button className="mt-6 text-sm font-semibold text-charcoal underline">
              {item.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
