type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
};

export function SectionTitle({ eyebrow, title, description, centered = false }: SectionTitleProps) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
    </div>
  );
}
