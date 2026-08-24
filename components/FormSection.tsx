// ─── Section wrapper: thick red rail + zinc eyebrow label ─────────
export function FormSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <div className="w-1 shrink-0 bg-red-600" aria-hidden="true" />
      <div className="flex-1 space-y-6 py-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}