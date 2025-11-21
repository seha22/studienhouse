type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="space-y-3 text-left">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">
          {eyebrow}
        </p>
      )}
      <h2 className="text-display-2 font-semibold text-charcoal">{title}</h2>
      {description && (
        <p className="max-w-2xl text-base text-muted">{description}</p>
      )}
    </div>
  );
}
