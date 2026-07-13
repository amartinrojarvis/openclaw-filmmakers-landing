export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-5 border-t border-[#f2eee5]/20 pt-7 sm:grid-cols-[13rem_1fr] sm:gap-10">
      <h2 className="font-editorial text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#f2eee5] sm:text-3xl">{title}</h2>
      <div className="min-w-0 space-y-4 leading-7 text-[#f2eee5]/62 [&_a]:text-[#ff5a2a] [&_a]:underline [&_strong]:font-bold [&_strong]:text-[#f2eee5]/90 [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:pl-5 [&_li]:marker:text-[#ff5a2a]">{children}</div>
    </section>
  );
}
