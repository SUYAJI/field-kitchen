import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion as Motion } from "motion/react";
import { AlertTriangle, ArrowDown, Check, ChevronDown, Copy, Leaf, Search, X } from "lucide-react";
import {
  getIngredient,
  INGREDIENT_CATEGORIES,
  INGREDIENTS,
  isAvailableInMonth,
  MONTHS,
  type Ingredient,
  type IngredientCategory,
  type IngredientId,
} from "../data";
import { formatRecommendationForCopy, recommend, type Recommendation } from "../recommend";
import { CURRENT_MONTH, IngredientThumb, ProvenanceBadge, SourceLink } from "../components";

type CategoryFilter = IngredientCategory | "All";

const QUICK_STARTS: { label: string; ids: IngredientId[] }[] = [
  { label: "Potatoes, cabbage & onion", ids: ["potato", "cabbage", "onion"] },
  { label: "Apples, kale & hazelnuts", ids: ["apple", "kale", "hazelnut"] },
  { label: "Mushrooms, onion & thyme", ids: ["mushroom", "onion", "thyme"] },
  { label: "Carrots, garlic & dill", ids: ["carrot", "garlic", "dill"] },
];

interface KitchenPlannerProps {
  selectedIds: IngredientId[];
  onToggle: (id: IngredientId) => void;
  onSetSelection: (ids: IngredientId[]) => void;
  onOpenSources: () => void;
}

export function KitchenPlanner({ selectedIds, onToggle, onSetSelection, onOpenSources }: KitchenPlannerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [inSeasonOnly, setInSeasonOnly] = useState(false);
  const ideasRef = useRef<HTMLElement>(null);

  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);
  const recommendations = useMemo(() => recommend(selectedIds), [selectedIds]);
  const readyCount = recommendations.filter((item) => item.status === "ready").length;

  const visibleIngredients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return INGREDIENTS.filter((ingredient) => {
      if (category !== "All" && ingredient.category !== category) return false;
      if (inSeasonOnly && !isAvailableInMonth(ingredient, CURRENT_MONTH)) return false;
      return !normalized || ingredient.name.toLowerCase().includes(normalized);
    });
  }, [query, category, inSeasonOnly]);

  const everyday = visibleIngredients.filter((item) => item.category !== "Specialty & botanicals");
  const specialty = visibleIngredients.filter((item) => item.category === "Specialty & botanicals");

  const scrollToIdeas = () => ideasRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="w-full lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(400px,42%)] xl:grid-cols-[minmax(0,1fr)_minmax(460px,40%)]">
      <section aria-labelledby="pick-heading" className="px-5 pb-10 pt-6 sm:px-6 lg:min-h-0 lg:overflow-y-auto lg:px-10 lg:pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b5401f]">Step 1</p>
        <h2 id="pick-heading" className="mt-1 font-['Playfair_Display'] text-4xl font-semibold tracking-[-0.02em] text-[#1a1a1a] md:text-5xl">
          What do you have?
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/70 md:text-base">
          Select the ingredients in your kitchen. Ideas update as you choose.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <label className="relative block max-w-md">
            <span className="sr-only">Search ingredients</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ingredients"
              className="h-11 w-full rounded-full border border-black/15 bg-white/70 pl-11 pr-4 text-sm text-black placeholder:text-black/50 focus:border-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            />
          </label>
          <div role="group" aria-label="Filter ingredients" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            {(["All", ...INGREDIENT_CATEGORIES] as CategoryFilter[]).map((option) => (
              <FilterChip key={option} pressed={category === option} onClick={() => setCategory(option)}>
                {option}
              </FilterChip>
            ))}
            <FilterChip pressed={inSeasonOnly} onClick={() => setInSeasonOnly((value) => !value)} accent>
              Typically available in {MONTHS[CURRENT_MONTH]}
            </FilterChip>
          </div>
          <p className="text-xs leading-relaxed text-black/65">
            Leaf markers show produce typically available in Oregon in {MONTHS[CURRENT_MONTH]}, based on a 2017 Oregon Department of Education chart. They do not reflect live supplier stock.
          </p>
        </div>

        {visibleIngredients.length === 0 ? (
          <p className="mt-10 text-sm text-black/65">No ingredients match these filters.</p>
        ) : (
          <>
            {everyday.length > 0 && (
              <IngredientGrid ingredients={everyday} selected={selected} onToggle={onToggle} label="Everyday ingredients" />
            )}
            {specialty.length > 0 && (
              <div className="mt-10">
                <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#1a1a1a]">Specialty &amp; botanicals</h3>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-black/65">
                  Regional specialties for infusions, soups and seasonal specials. Buy from reputable suppliers; Field Kitchen does not identify wild plants or mushrooms.
                </p>
                <IngredientGrid ingredients={specialty} selected={selected} onToggle={onToggle} label="Specialty and botanical ingredients" />
              </div>
            )}
          </>
        )}
      </section>

      <section
        id="ideas"
        ref={ideasRef}
        aria-labelledby="ideas-heading"
        className="scroll-mt-4 border-t border-black/10 bg-white/55 px-5 pb-28 pt-8 backdrop-blur-sm sm:px-6 lg:min-h-0 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:px-8 lg:pb-10"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b5401f]">Step 2</p>
        <h2 id="ideas-heading" className="mt-1 font-['Playfair_Display'] text-3xl font-semibold tracking-[-0.02em] text-[#1a1a1a] md:text-4xl">
          What you could make
        </h2>

        {selectedIds.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/60">Your ingredients</h3>
              <button
                type="button"
                onClick={() => onSetSelection([])}
                className="min-h-11 px-2 text-xs font-semibold text-black/65 underline decoration-black/25 underline-offset-2 hover:text-black"
              >
                Clear all
              </button>
            </div>
            <ul className="mt-1 flex flex-wrap gap-2">
              {selectedIds.map((id) => {
                const ingredient = getIngredient(id);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onToggle(id)}
                      aria-label={`Remove ${ingredient.name}`}
                      className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 bg-white py-1 pl-1.5 pr-3 text-sm text-black/80 transition-colors hover:border-black/40"
                    >
                      <IngredientThumb id={id} size={30} />
                      {ingredient.name}
                      <X aria-hidden="true" className="h-3.5 w-3.5 text-black/50 group-hover:text-black" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <p aria-live="polite" className="mt-5 text-sm text-black/70">
          {selectedIds.length === 0
            ? ""
            : recommendations.length === 0
              ? "No ideas use this combination yet. Try adding a staple such as potatoes or onions."
              : `${recommendations.length} ${recommendations.length === 1 ? "idea" : "ideas"} · ${readyCount} need only pantry staples`}
        </p>

        {selectedIds.length === 0 ? (
          <EmptyState onPick={onSetSelection} />
        ) : (
          <RecommendationList recommendations={recommendations} onAdd={onToggle} />
        )}

        <p className="mt-10 border-t border-black/10 pt-5 text-xs leading-relaxed text-black/65">
          Ideas are preparation concepts, not tested recipes. Each one shows whether it is an established dish or a Field Kitchen suggestion, and links its sources.{" "}
          <button type="button" onClick={onOpenSources} className="font-semibold text-black/80 underline decoration-black/25 underline-offset-2 hover:text-black">
            How the data works
          </button>
        </p>
      </section>

      {selectedIds.length > 0 && (
        <div className="fixed inset-x-3 bottom-3 z-[90] lg:hidden">
          <button
            type="button"
            onClick={scrollToIdeas}
            className="flex min-h-12 w-full items-center justify-between gap-3 rounded-full bg-[#1a1a1a] px-5 text-sm font-semibold text-[#faf9f6] shadow-xl"
          >
            <span>
              {selectedIds.length} selected · {recommendations.length} {recommendations.length === 1 ? "idea" : "ideas"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              See ideas <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ pressed, onClick, children, accent = false }: { pressed: boolean; onClick: () => void; children: ReactNode; accent?: boolean }) {
  const active = accent ? "border-[#b5401f] bg-[#b5401f] text-white" : "border-[#1a1a1a] bg-[#1a1a1a] text-[#faf9f6]";
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-11 shrink-0 rounded-full border px-4 text-xs font-semibold tracking-wide transition-colors duration-300 ${pressed ? active : "border-black/15 bg-white/50 text-black/70 hover:border-black/35 hover:text-black"}`}
    >
      {children}
    </button>
  );
}

function IngredientGrid({ ingredients, selected, onToggle, label }: { ingredients: Ingredient[]; selected: Set<IngredientId>; onToggle: (id: IngredientId) => void; label: string }) {
  return (
    <ul aria-label={label} className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 xl:grid-cols-5 2xl:grid-cols-6">
      {ingredients.map((ingredient) => {
        const isSelected = selected.has(ingredient.id);
        const inSeason = isAvailableInMonth(ingredient, CURRENT_MONTH);
        return (
          <li key={ingredient.id}>
            <button
              type="button"
              aria-pressed={isSelected}
              aria-label={inSeason ? `${ingredient.name}, typically available in Oregon in ${MONTHS[CURRENT_MONTH]}` : ingredient.name}
              onClick={() => onToggle(ingredient.id)}
              className={`group relative flex aspect-[4/5] w-full flex-col justify-end overflow-hidden rounded-xl text-left transition-[box-shadow,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2 active:scale-[0.98] ${isSelected ? "shadow-lg ring-2 ring-[#1a1a1a] ring-offset-2 ring-offset-[#faf9f6]" : "shadow-sm hover:shadow-md"}`}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${ingredient.image})`, backgroundColor: ingredient.color }}
              />
              <span aria-hidden="true" className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${isSelected ? "from-black/85 via-black/35 to-black/10" : "from-black/75 via-black/15 to-transparent"}`} />
              {inSeason && (
                <span aria-hidden="true" className="absolute left-2 top-2 inline-flex h-6 items-center gap-1 rounded-full bg-[#faf9f6]/90 px-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#1f5e47] sm:px-2">
                  <Leaf className="h-3 w-3" />
                  <span className="hidden sm:inline">Typical {MONTHS[CURRENT_MONTH]}</span>
                </span>
              )}
              <span
                aria-hidden="true"
                className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 ${isSelected ? "scale-100 border-[#b5401f] bg-[#b5401f] text-white" : "scale-90 border-white/70 bg-black/15 text-transparent"}`}
              >
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="relative z-10 hyphens-auto p-2 font-['Playfair_Display'] text-[13px] font-semibold leading-tight text-white sm:p-3 sm:text-lg">
                {ingredient.name}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function EmptyState({ onPick }: { onPick: (ids: IngredientId[]) => void }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-black/20 p-5 sm:p-6">
      <p className="font-['Playfair_Display'] text-xl text-[#1a1a1a]">Choose a few ingredients to see dishes, sides, drinks and preserves you could make.</p>
      <p className="mt-2 text-sm text-black/70">Or start from a typical delivery:</p>
      <ul className="mt-4 flex flex-col gap-2">
        {QUICK_STARTS.map((start) => (
          <li key={start.label}>
            <button
              type="button"
              onClick={() => onPick(start.ids)}
              className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-black/10 bg-white/80 px-3 text-left text-sm font-medium text-black/80 transition-colors hover:border-black/30 hover:text-black"
            >
              <span className="flex -space-x-2">
                {start.ids.map((id) => <IngredientThumb key={id} id={id} size={28} />)}
              </span>
              {start.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecommendationList({ recommendations, onAdd }: { recommendations: Recommendation[]; onAdd: (id: IngredientId) => void }) {
  const topReadyId = recommendations[0]?.status === "ready" ? recommendations[0].preparation.id : null;
  const [expandedId, setExpandedId] = useState<string | null | undefined>(undefined);
  const effectiveId = expandedId === undefined ? topReadyId : expandedId;

  useEffect(() => {
    if (expandedId && !recommendations.some((item) => item.preparation.id === expandedId)) {
      setExpandedId(undefined);
    }
  }, [expandedId, recommendations]);

  return (
    <ol className="mt-4 flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {recommendations.map((recommendation) => (
          <Motion.li
            key={recommendation.preparation.id}
            layout="position"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <RecommendationCard
              recommendation={recommendation}
              expanded={effectiveId === recommendation.preparation.id}
              onToggle={() => setExpandedId(effectiveId === recommendation.preparation.id ? null : recommendation.preparation.id)}
              onAdd={onAdd}
            />
          </Motion.li>
        ))}
      </AnimatePresence>
    </ol>
  );
}

function RecommendationCard({
  recommendation,
  expanded,
  onToggle,
  onAdd,
}: {
  recommendation: Recommendation;
  expanded: boolean;
  onToggle: () => void;
  onAdd: (id: IngredientId) => void;
}) {
  const { preparation, status, usedIds, missing, couldAdd } = recommendation;
  const panelId = `prep-${preparation.id}`;
  const ready = status === "ready";

  return (
    <article
      aria-labelledby={`${panelId}-name`}
      className={`overflow-hidden rounded-2xl border bg-white transition-shadow duration-300 ${expanded ? "border-black/20 shadow-lg" : "border-black/10 shadow-sm hover:shadow-md"}`}
    >
      <h3 id={`${panelId}-title`} className="m-0">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full flex-col gap-3 p-4 text-left sm:p-5"
        >
          <span className="flex w-full flex-col gap-1">
            <span className="flex w-full flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/60">
                {preparation.category} · {preparation.technique} · {preparation.basis.kind === "established" ? "Established preparation" : "Curated idea"}
              </span>
              <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${ready ? "bg-[#2a7d5f]/12 text-[#1f5e47]" : "bg-[#b5401f]/10 text-[#9a3412]"}`}>
                {ready ? "Ready with pantry staples" : `Needs ${missing.length} more`}
              </span>
            </span>
            <span id={`${panelId}-name`} className="font-['Playfair_Display'] text-2xl font-semibold leading-tight text-[#1a1a1a]">{preparation.name}</span>
          </span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-black/75">
            <span className="flex -space-x-1.5">
              {usedIds.map((id) => <IngredientThumb key={id} id={id} size={26} />)}
            </span>
            <span>
              Uses <span className="font-semibold text-black/85">{usedIds.map((id) => getIngredient(id).name).join(", ")}</span>
              {!ready && (
                <span className="text-[#9a3412]"> · needs {missing.map((component) => component.label.toLowerCase()).join(", ")}</span>
              )}
            </span>
          </span>
          <span className="flex w-full items-end justify-between gap-3">
            <span className="text-sm leading-relaxed text-black/70">{preparation.summary}</span>
            <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 text-black/50 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {expanded && (
          <Motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <PreparationDetail recommendation={recommendation} missing={missing} couldAdd={couldAdd} onAdd={onAdd} />
          </Motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function PreparationDetail({
  recommendation,
  missing,
  couldAdd,
  onAdd,
}: {
  recommendation: Recommendation;
  missing: Recommendation["missing"];
  couldAdd: Recommendation["couldAdd"];
  onAdd: (id: IngredientId) => void;
}) {
  const { preparation } = recommendation;
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    const text = formatRecommendationForCopy(recommendation);
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 2500);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  return (
    <div className="border-t border-black/10 px-4 pb-5 pt-4 sm:px-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <IngredientGroup title="You have">
          {recommendation.usedIds.map((id) => (
            <li key={id} className="flex items-center gap-2 text-sm text-black/80">
              <IngredientThumb id={id} size={22} /> {getIngredient(id).name}
            </li>
          ))}
        </IngredientGroup>
        {missing.length > 0 && (
          <IngredientGroup title="You also need">
            {missing.map((component) => (
              <ComponentRow key={component.label} label={component.label} options={component.options} onAdd={onAdd} tone="missing" />
            ))}
          </IngredientGroup>
        )}
        {couldAdd.length > 0 && (
          <IngredientGroup title="Optional">
            {couldAdd.map((component) => (
              <ComponentRow key={component.label} label={component.label} options={component.options} onAdd={onAdd} tone="optional" />
            ))}
          </IngredientGroup>
        )}
        <IngredientGroup title="Pantry staples (assumed on hand)">
          <li className="text-sm leading-relaxed text-black/75">{preparation.pantry.join(", ")}</li>
        </IngredientGroup>
      </div>

      <h4 className="mt-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-black/60">Method outline</h4>
      <p className="mt-1 text-xs text-black/65">Untested concept: no quantities, yields or timings. Adjust to your kitchen.</p>
      <ol className="mt-2 flex flex-col gap-2">
        {preparation.method.map((step, index) => (
          <li key={step} className="flex gap-3 text-sm leading-relaxed text-black/80">
            <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-[10px] font-semibold text-white">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <h4 className="mt-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-black/60">Why it works</h4>
      <p className="mt-2 text-sm leading-relaxed text-black/80">{preparation.why}</p>

      {preparation.safetyNote && (
        <p className="mt-4 flex gap-2 rounded-xl border border-[#b7791f]/30 bg-[#b7791f]/8 p-3 text-sm leading-relaxed text-[#5c3d0e]">
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {preparation.safetyNote}
        </p>
      )}

      <div className="mt-6 rounded-xl bg-[#faf9f6] p-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <ProvenanceBadge
            level={preparation.basis.kind === "established" ? "sourced" : "curated"}
            label={preparation.basis.kind === "established" ? "Established preparation" : "Curated by Field Kitchen"}
          />
          <span className="text-xs text-black/65">Preparation concept, not a tested recipe</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-black/70">{preparation.basis.note}</p>
        {preparation.basis.sourceIds.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1.5">
            {preparation.basis.sourceIds.map((id) => (
              <li key={id}><SourceLink id={id} /></li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1a1a1a] px-5 text-sm font-semibold text-[#faf9f6] transition-colors hover:bg-black"
        >
          {copyState === "copied" ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
          Copy idea
        </button>
        <span role="status" className="text-xs text-black/70">
          {copyState === "copied" ? "Copied to clipboard as plain text." : copyState === "failed" ? "Copy is unavailable in this browser." : ""}
        </span>
      </div>
    </div>
  );
}

function IngredientGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/60">{title}</h4>
      <ul className="mt-2 flex flex-col gap-1.5">{children}</ul>
    </div>
  );
}

function ComponentRow({ label, options, onAdd, tone }: { label: string; options: readonly IngredientId[]; onAdd: (id: IngredientId) => void; tone: "missing" | "optional" }) {
  return (
    <li className="flex flex-wrap items-center gap-1.5 text-sm text-black/80">
      <span className={tone === "missing" ? "font-semibold text-[#9a3412]" : ""}>{label}</span>
      {options.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onAdd(id)}
          className="inline-flex min-h-8 items-center gap-1 rounded-full border border-dashed border-black/25 px-2 text-[11px] font-semibold text-black/70 hover:border-black/50 hover:text-black"
        >
          + {getIngredient(id).name}
          <span className="sr-only"> to your ingredients</span>
        </button>
      ))}
    </li>
  );
}
