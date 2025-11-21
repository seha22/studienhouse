import type { JSX } from "react";
import Image from "next/image";
import { BenefitIcon, WhyChooseContent } from "@/lib/landing-content";
import { SectionHeader } from "./SectionHeader";

type Props = {
  content: WhyChooseContent;
};

const icons: Record<BenefitIcon, JSX.Element> = {
  calendar: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="24" height="22" rx="4" stroke="#1C1A1E" strokeWidth="2" />
      <path d="M10 4v6M22 4v6M8 14h16" stroke="#1C1A1E" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 20h4v4h-4z" fill="#1C1A1E" stroke="#1C1A1E" strokeWidth="2" />
    </svg>
  ),
  progress: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="24" height="18" rx="4" stroke="#1C1A1E" strokeWidth="2" />
      <path d="M10 24v4l6-4" stroke="#1C1A1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="15" r="2" fill="#1C1A1E" />
      <circle cx="20" cy="15" r="2" fill="#1C1A1E" />
      <path d="M12 19c1.333 1 2.667 1 4 0" stroke="#1C1A1E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

export function WhyChooseSection({ content }: Props) {
  return (
    <section id="cara-kerja" className="container grid gap-12 py-16 lg:grid-cols-2">
      <div className="space-y-8">
        <SectionHeader {...content.header} />
        <div className="grid gap-5">
          {content.benefits.map((benefit) => (
            <div
              key={benefit.title}
              className={`${benefit.color} flex items-center gap-5 rounded-[2.75rem] px-6 py-5 shadow-card`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70">
                {icons[benefit.icon]}
              </div>
              <div>
                <p className="text-lg font-semibold text-charcoal">{benefit.title}</p>
                <p className="text-sm text-muted">{benefit.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {content.gallery[0] && (
          <div className="rounded-[3rem] bg-white p-6 shadow-display">
            <Image
              src={content.gallery[0]}
              alt="Discussion"
              width={480}
              height={300}
              className="h-64 w-full rounded-[2.5rem] object-cover"
            />
          </div>
        )}
        {content.gallery[1] && (
          <div className="rounded-[3rem] bg-peach p-6 shadow-card">
            <Image
              src={content.gallery[1]}
              alt="Workshop"
              width={480}
              height={300}
              className="h-48 w-full rounded-[2rem] object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
