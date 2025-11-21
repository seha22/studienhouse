import Image from "next/image";
import { AboutContent } from "@/lib/landing-content";
import { SectionHeader } from "./SectionHeader";

type Props = {
  content: AboutContent;
};

export function AboutSection({ content }: Props) {
  return (
    <section
      id="tentang"
      className="container grid gap-12 pb-16 pt-10 scroll-mt-32 lg:grid-cols-[minmax(0,1fr)_420px]"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {content.collage.map((image) => (
          <Image
            key={image}
            src={image}
            alt="Community"
            width={420}
            height={320}
            className="h-64 w-full rounded-[3rem] object-cover"
          />
        ))}
      </div>
      <div className="space-y-8">
        <SectionHeader {...content.header} />
        <ul className="space-y-4 text-base text-stone">
          {content.bullets.map((item) => (
            <li key={item.text} className="flex gap-3">
              <span className={`mt-2 h-1.5 w-8 rounded-full ${item.color}`}></span>
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
