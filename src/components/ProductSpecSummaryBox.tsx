import { cn } from "@/lib/utils";

export function ProductSpecSummaryBox({
  text,
  className,
}: {
  text: string | null | undefined;
  className?: string;
}) {
  if (!text?.trim()) return null;

  return (
    <div className={cn("rounded-xl border border-border bg-subtle/60 px-3.5 py-3", className)}>
      <p className="text-sm font-semibold leading-relaxed text-foreground">{text}</p>
    </div>
  );
}
