import { SectionHeader } from "./SectionHeader";
import { TestimonialsSection } from "@/lib/landing-content";

type Props = {
  content: TestimonialsSection;
};

export function Testimonials({ content }: Props) {
  if (!content.items || content.items.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ivory via-white to-cloud py-16">
      <div className="absolute left-8 top-10 h-32 w-32 rounded-full bg-mint blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-peach blur-3xl" aria-hidden="true" />

      <div className="container relative grid gap-10 lg:grid-cols-[1.05fr,1.4fr]">
        <div className="space-y-6">
          <SectionHeader {...content.header} />
          <div className="rounded-3xl bg-white/70 p-5 shadow-card ring-1 ring-line backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-peach text-graphite">
                “
              </span>
              Sorotan siswa
            </div>
            <p className="mt-3 text-base leading-relaxed text-graphite">
              “{content.items[0].quote}”
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm text-stone">
              <span className="font-semibold text-charcoal">{content.items[0].name || "Siswa"}</span>
              {content.items[0].role ? (
                <>
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-muted" />
                  <span>{content.items[0].role}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {content.items.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="flex h-full flex-col justify-between rounded-[1.8rem] border border-line bg-white/85 p-5 shadow-card backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cloud text-base font-semibold text-charcoal">
                    {(item.name?.trim()[0] || "S").toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{item.name || "Siswa"}</p>
                    {item.role ? <p className="text-xs text-muted">{item.role}</p> : null}
                  </div>
                </div>
                <span aria-hidden="true" className="text-2xl text-orange">
                  “
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-graphite">
                {item.quote}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
