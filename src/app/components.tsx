import { ArrowUpRight } from "lucide-react";
import { getIngredient, getSource, PROVENANCE_LABELS, type IngredientId, type Provenance, type SourceId } from "./data";

const PROVENANCE_STYLES: Record<Provenance, string> = {
  sourced: "bg-[#2a7d5f]/10 text-[#1f5e47] border-[#2a7d5f]/25",
  curated: "bg-[#b7791f]/10 text-[#7a4f12] border-[#b7791f]/25",
  assumption: "bg-black/5 text-black/60 border-black/15",
};

const PROVENANCE_DOTS: Record<Provenance, string> = {
  sourced: "bg-[#2a7d5f]",
  curated: "bg-[#b7791f]",
  assumption: "bg-black/40",
};

export function ProvenanceBadge({ level, label }: { level: Provenance; label?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${PROVENANCE_STYLES[level]}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${PROVENANCE_DOTS[level]}`} />
      {label ?? PROVENANCE_LABELS[level]}
    </span>
  );
}

export function SourceLink({ id }: { id: SourceId }) {
  const source = getSource(id);
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-start gap-1 text-xs leading-snug text-black/65 underline decoration-black/20 underline-offset-2 hover:text-black hover:decoration-black/60"
    >
      <span>
        {source.title}
        <span className="text-black/60"> · {source.publisher}</span>
      </span>
      <ArrowUpRight aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 opacity-60 group-hover:opacity-100" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function IngredientThumb({ id, size = 28, muted = false }: { id: IngredientId; size?: number; muted?: boolean }) {
  const ingredient = getIngredient(id);
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-full bg-cover bg-center ring-2 ring-[#faf9f6] ${muted ? "opacity-40 grayscale" : ""}`}
      style={{ width: size, height: size, backgroundImage: `url(${ingredient.image})`, backgroundColor: ingredient.color }}
    />
  );
}

export const CURRENT_MONTH = new Date().getMonth();
