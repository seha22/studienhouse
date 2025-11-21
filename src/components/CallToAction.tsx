import Link from "next/link";
import { CTAContent } from "@/lib/landing-content";

type Props = {
  content: CTAContent;
};

export function CallToAction({ content }: Props) {
  const styles: Record<CTAContent["buttons"][number]["style"], string> = {
    primary: "rounded-pill bg-orange px-4 py-2 text-sm font-semibold text-charcoal",
    secondary: "rounded-pill bg-cloud px-4 py-2 text-sm font-semibold text-charcoal",
  };

  return (
    <div className="container pb-6 text-center text-sm text-muted">
      <div className="flex flex-col items-center gap-3">
        <p className="text-charcoal font-semibold">{content.title}</p>
        <div className="flex gap-3">
          {content.buttons.map((btn) => (
            <Link key={btn.href + btn.label} href={btn.href} className={styles[btn.style]}>
              {btn.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
