import { NewsletterContent } from "@/lib/landing-content";

type Props = {
  content: NewsletterContent;
};

export function Newsletter({ content }: Props) {
  return (
    <section className="container py-16">
      <div className="flex flex-col gap-8 rounded-[3.5rem] bg-peach px-10 py-12 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="text-display-2 font-semibold text-charcoal">{content.title}</p>
          <p className="text-base text-muted">{content.description}</p>
        </div>
        <form className="flex w-full items-center gap-4 rounded-pill bg-white px-6 py-4 shadow-pill md:w-auto">
          <input
            type="email"
            placeholder={content.placeholder}
            className="flex-1 border-none text-sm text-stone outline-none"
          />
          <button
            type="submit"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-orange text-charcoal"
            aria-label={content.buttonLabel}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 12L12 4M6 4h6v6"
                stroke="#1C1A1E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}
