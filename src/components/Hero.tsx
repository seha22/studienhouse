import Image from "next/image";
import { HeroContent } from "@/lib/landing-content";
import { Button } from "./Button";

type Props = {
  content: HeroContent;
};

export function Hero({ content }: Props) {
  return (
    <section id="home" className="container grid gap-10 pb-16 pt-12 lg:grid-cols-[minmax(0,1fr)_520px]">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 text-sm font-semibold uppercase text-orange">
          <span className="h-px w-8 bg-orange"></span>
          {content.eyebrow}
        </div>
        <div className="space-y-5">
          <h1 className="text-display-1 font-semibold text-charcoal">
            {content.title}{" "}
            <span className="text-orange">{content.highlight}</span>
          </h1>
          <p className="max-w-xl text-lg text-stone">{content.description}</p>
        </div>
        <Button className="w-fit">{content.ctaLabel}</Button>

        <div className="flex flex-wrap gap-8 pt-4">
          {content.stats.map((stat) => (
            <div key={stat.label + stat.value}>
              <div className="text-2xl font-semibold text-charcoal">
                {stat.value}
              </div>
              <p className="text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative isolate">
        <div className="rounded-blob bg-white p-6 shadow-display">
          <div className="relative overflow-hidden rounded-[2.75rem] bg-cloud">
            <Image
              src={content.heroImage}
              alt="Student"
              width={520}
              height={620}
              className="h-[540px] w-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="absolute left-6 top-8 rounded-3xl bg-peach px-5 py-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {content.badge.title}
          </p>
          <p className="text-base font-semibold text-charcoal">{content.badge.subtitle}</p>
          <p className="text-sm text-muted">{content.badge.description}</p>
        </div>

        <div className="absolute right-0 bottom-5 flex items-center gap-3 rounded-3xl bg-mint px-5 py-4 shadow-card">
          <Image
            src={content.heroAvatar}
            alt="Karen"
            width={56}
            height={56}
            className="h-14 w-14 rounded-2xl object-cover"
          />
          <div>
            <p className="text-base font-semibold text-charcoal">{content.mentor.name}</p>
            <p className="flex items-center gap-2 text-sm text-muted">
              <span>{content.mentor.role}</span>
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-muted"
              />
              <span>{content.mentor.experience}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
