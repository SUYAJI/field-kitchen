import { useRef, useState, type RefObject } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Check, Plus, X } from "lucide-react";
import { fdcUrl, INGREDIENT_CATEGORIES, INGREDIENTS, MONTH_INITIALS, MONTHS, type Ingredient, type IngredientId } from "../data";
import { preparationsUsing } from "../recommend";
import { useMediaQuery, useOverlayFocus } from "../accessibility";
import { CURRENT_MONTH, ProvenanceBadge, SourceLink } from "../components";

interface IngredientLibraryProps {
  selectedIds: IngredientId[];
  onToggle: (id: IngredientId) => void;
  onOpenKitchen: () => void;
}

export function IngredientLibrary({ selectedIds, onToggle, onOpenKitchen }: IngredientLibraryProps) {
  const [detail, setDetail] = useState<Ingredient | null>(null);
  const detailPanelRef = useRef<HTMLElement>(null);
  const detailCloseRef = useRef<HTMLButtonElement>(null);
  const detailTriggerRef = useRef<HTMLElement | null>(null);
  const isModalDetail = useMediaQuery("(max-width: 1023px)");

  useOverlayFocus({
    open: Boolean(detail),
    containerRef: detailPanelRef,
    initialFocusRef: detailCloseRef,
    restoreFocusRef: detailTriggerRef,
    onClose: () => setDetail(null),
    trapFocus: isModalDetail,
  });

  return (
    <div className="relative flex w-full min-h-0 overflow-visible lg:h-full lg:overflow-hidden">
      <section
        aria-labelledby="ingredients-heading"
        className={`flex-1 overflow-visible px-5 pb-16 pt-6 transition-[padding] duration-500 sm:px-6 lg:overflow-y-auto lg:px-10 lg:pt-8 ${detail ? "lg:pr-[460px]" : ""}`}
      >
        <h2 id="ingredients-heading" className="font-['Playfair_Display'] text-4xl font-semibold tracking-[-0.02em] text-[#1a1a1a] md:text-5xl">
          Ingredients
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/70 md:text-base">
          Reference details for every ingredient: USDA nutrition records, Oregon availability where a source exists, and the ideas each one appears in.
        </p>

        {INGREDIENT_CATEGORIES.map((category) => {
          const items = INGREDIENTS.filter((item) => item.category === category);
          return (
            <div key={category} className="mt-8">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/60">{category}</h3>
              <ul className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
                {items.map((ingredient) => (
                  <li key={ingredient.id}>
                    <button
                      type="button"
                      onClick={(event) => {
                        detailTriggerRef.current = event.currentTarget;
                        setDetail(ingredient);
                      }}
                      aria-expanded={detail?.id === ingredient.id}
                      aria-controls="ingredient-detail-panel"
                      aria-label={`${ingredient.name}. Open ingredient details.`}
                      className={`group flex w-full items-center gap-3 rounded-xl border bg-white/70 p-2 text-left transition-all duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] ${detail?.id === ingredient.id ? "border-black/40 shadow-md" : "border-black/10"}`}
                    >
                      <span
                        aria-hidden="true"
                        className="h-14 w-14 shrink-0 rounded-lg bg-cover bg-center"
                        style={{ backgroundImage: `url(${ingredient.image})`, backgroundColor: ingredient.color }}
                      />
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-['Playfair_Display'] text-lg font-semibold text-[#1a1a1a]">{ingredient.name}</span>
                        <span className="text-xs text-black/60">
                          {preparationsUsing(ingredient.id).length} {preparationsUsing(ingredient.id).length === 1 ? "idea" : "ideas"}
                          {selectedIds.includes(ingredient.id) ? " · in your kitchen" : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <AnimatePresence>
        {detail && (
          <Motion.aside
            id="ingredient-detail-panel"
            ref={detailPanelRef}
            role={isModalDetail ? "dialog" : "complementary"}
            aria-modal={isModalDetail ? "true" : undefined}
            aria-labelledby="ingredient-detail-title"
            tabIndex={-1}
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex h-dvh w-full flex-col overflow-y-auto bg-[#faf9f6] shadow-2xl lg:absolute lg:inset-auto lg:right-0 lg:top-0 lg:h-full lg:max-w-[440px] lg:border-l lg:border-black/10"
          >
            <IngredientDetail
              ingredient={detail}
              inKitchen={selectedIds.includes(detail.id)}
              closeRef={detailCloseRef}
              onClose={() => setDetail(null)}
              onToggle={() => onToggle(detail.id)}
              onOpenKitchen={onOpenKitchen}
            />
          </Motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function IngredientDetail({
  ingredient,
  inKitchen,
  closeRef,
  onClose,
  onToggle,
  onOpenKitchen,
}: {
  ingredient: Ingredient;
  inKitchen: boolean;
  closeRef: RefObject<HTMLButtonElement>;
  onClose: () => void;
  onToggle: () => void;
  onOpenKitchen: () => void;
}) {
  const { availability, nutrition } = ingredient;
  const uses = preparationsUsing(ingredient.id);

  return (
    <>
      <div className="relative h-44 shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ingredient.image})`, backgroundColor: ingredient.color }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-transparent to-transparent" />
        <button
          ref={closeRef}
          type="button"
          aria-label="Close ingredient details"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/85 backdrop-blur-md transition-colors hover:bg-white"
        >
          <X className="h-4 w-4 text-black/70" />
        </button>
      </div>

      <div className="relative z-10 -mt-6 flex flex-1 flex-col gap-7 px-5 pb-8 sm:px-7">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/60">{ingredient.category}</p>
          <h2 id="ingredient-detail-title" className="font-['Playfair_Display'] text-4xl font-semibold tracking-[-0.02em] text-[#1a1a1a]">
            {ingredient.name}
          </h2>
          {ingredient.note && <p className="mt-2 text-sm leading-relaxed text-black/75">{ingredient.note}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={inKitchen}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${inKitchen ? "bg-[#1a1a1a] text-[#faf9f6]" : "border border-black/20 bg-white text-black/80 hover:border-black/40"}`}
            >
              {inKitchen ? <Check aria-hidden="true" className="h-4 w-4" /> : <Plus aria-hidden="true" className="h-4 w-4" />}
              {inKitchen ? "In your kitchen" : "Add to your kitchen"}
            </button>
            {inKitchen && (
              <button type="button" onClick={onOpenKitchen} className="min-h-11 px-2 text-sm font-semibold text-black/70 underline decoration-black/25 underline-offset-2 hover:text-black">
                See ideas
              </button>
            )}
          </div>
        </div>

        <section aria-labelledby="availability-heading">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id="availability-heading" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/60">Typical Oregon availability</h3>
            {availability ? <ProvenanceBadge level="sourced" /> : null}
          </div>
          {availability ? (
            <>
              <div className="mt-3 grid grid-cols-12 gap-[3px]" aria-label={`Available ${availability.months.map((month) => MONTHS[month]).join(", ")}`} role="img">
                {MONTHS.map((month, index) => {
                  const active = availability.months.includes(index);
                  return (
                    <div key={month} className="flex flex-col items-center gap-1">
                      <div className={`h-6 w-full rounded-sm ${index === CURRENT_MONTH ? "ring-2 ring-[#1a1a1a] ring-offset-1" : ""}`} style={{ backgroundColor: active ? ingredient.color : "rgba(0,0,0,0.06)" }} />
                      <span className={`text-[10px] font-semibold ${index === CURRENT_MONTH ? "text-black" : "text-black/55"}`}>{MONTH_INITIALS[index]}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-black/65">From a 2017 Oregon Department of Education chart, not live supplier stock. The outlined month is the current month. The chart does not distinguish fresh harvest from storage.</p>
              <div className="mt-2"><SourceLink id={availability.sourceId} /></div>
            </>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-black/20 p-3 text-sm text-black/70">
              Not shown: no verified regional availability source yet.
            </p>
          )}
        </section>

        <section aria-labelledby="nutrition-heading">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id="nutrition-heading" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/60">Nutrition per 100 g</h3>
            {nutrition ? <ProvenanceBadge level="sourced" /> : null}
          </div>
          {nutrition ? (
            <>
              <dl className="mt-3 grid grid-cols-2 gap-2">
                {[
                  ["Energy", `${nutrition.energyKcal} kcal`],
                  ["Protein", `${nutrition.proteinG} g`],
                  ["Fiber", `${nutrition.fiberG} g`],
                  ["Vitamin C", nutrition.vitaminCMg === null ? "Not reported" : `${nutrition.vitaminCMg} mg`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-black/10 bg-white/80 p-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/60">{label}</dt>
                    <dd className="mt-1 font-['Playfair_Display'] text-xl tabular-nums text-[#1a1a1a]">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-black/65">
                USDA record: <span className="font-semibold text-black/75">{nutrition.description}</span> (FDC {nutrition.fdcId}). Values describe this record only, not every variety or preparation.
              </p>
              <a
                href={fdcUrl(nutrition.fdcId)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-black/70 underline decoration-black/20 underline-offset-2 hover:text-black"
              >
                View on USDA FoodData Central <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-black/20 p-3 text-sm text-black/70">
              Not shown: no matching USDA FoodData Central record.
            </p>
          )}
        </section>

        <section aria-labelledby="uses-heading">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id="uses-heading" className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/60">Used in</h3>
          </div>
          <ul className="mt-3 flex flex-col gap-2">
            {uses.map((preparation) => (
              <li key={preparation.id} className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-white/80 px-3 py-2.5">
                <span className="font-['Playfair_Display'] text-lg text-[#1a1a1a]">{preparation.name}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/60">{preparation.category}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
