import { useEffect, useMemo, useRef, useState } from "react";
import { motion as Motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { INGREDIENTS, isAvailableInMonth, MONTHS, type IngredientId } from "../data";
import { CURRENT_MONTH, ProvenanceBadge, SourceLink } from "../components";
import { useMediaQuery } from "../accessibility";

export function SeasonalMap({ selectedIds, onToggle }: { selectedIds: IngredientId[]; onToggle: (id: IngredientId) => void }) {
  const [nowOnly, setNowOnly] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isNarrow = useMediaQuery("(max-width: 639px)");
  const nameColumn = isNarrow ? 124 : 170;

  const sourced = useMemo(
    () => INGREDIENTS.filter((item) => item.availability && (!nowOnly || isAvailableInMonth(item, CURRENT_MONTH))),
    [nowOnly]
  );
  const unsourced = INGREDIENTS.filter((item) => !item.availability);

  // On narrow screens, start the scrollable timeline at the current month.
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline || timeline.scrollWidth <= timeline.clientWidth) return;
    const monthWidth = (timeline.scrollWidth - nameColumn) / 12;
    timeline.scrollLeft = Math.max(0, monthWidth * (CURRENT_MONTH - 1));
  }, [nameColumn]);

  return (
    <section aria-labelledby="seasons-heading" className="w-full min-h-0 px-5 pb-16 pt-6 sm:px-6 lg:h-full lg:overflow-y-auto lg:px-10 lg:pt-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 id="seasons-heading" className="font-['Playfair_Display'] text-4xl font-semibold tracking-[-0.02em] text-[#1a1a1a] md:text-5xl">
            Seasons
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/70 md:text-base">
            When Oregon-grown product is marked as available, for planning seasonal specials. This month is {MONTHS[CURRENT_MONTH]}.
          </p>
        </div>
        <div role="group" aria-label="Filter by availability" className="flex flex-wrap gap-2">
          {[
            { label: "All months", value: false },
            { label: `Available in ${MONTHS[CURRENT_MONTH]}`, value: true },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={nowOnly === option.value}
              onClick={() => setNowOnly(option.value)}
              className={`min-h-11 rounded-full border px-4 text-xs font-semibold tracking-wide transition-colors ${nowOnly === option.value ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#faf9f6]" : "border-black/15 text-black/70 hover:border-black/35"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-black/65">
        <ProvenanceBadge level="sourced" />
        <SourceLink id="ode-availability" />
      </div>

      <div ref={timelineRef} className="mt-6 overflow-x-auto overscroll-x-contain pb-4">
        <table className="w-full min-w-[760px] border-separate border-spacing-y-1.5 text-left">
          <caption className="sr-only">Months in which each ingredient is marked available in Oregon</caption>
          <thead>
            <tr className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/60">
              <th scope="col" className="sticky left-0 z-10 bg-[#faf9f6] pl-1 font-semibold" style={{ width: nameColumn }}>Ingredient</th>
              {MONTHS.map((month, index) => (
                <th key={month} scope="col" className={`text-center font-semibold ${index === CURRENT_MONTH ? "text-[#b5401f]" : ""}`}>
                  {month}
                  {index === CURRENT_MONTH && <span className="block text-[9px] tracking-[0.15em]">Now</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sourced.map((ingredient, rowIndex) => {
              const inKitchen = selectedIds.includes(ingredient.id);
              return (
                <Motion.tr key={ingredient.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: rowIndex * 0.02 }}>
                  <th scope="row" className="sticky left-0 z-10 bg-[#faf9f6] py-1 pr-2 font-normal">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-['Playfair_Display'] text-base text-[#1a1a1a] sm:text-lg">{ingredient.name}</span>
                      <button
                        type="button"
                        onClick={() => onToggle(ingredient.id)}
                        aria-pressed={inKitchen}
                        aria-label={inKitchen ? `Remove ${ingredient.name} from your kitchen` : `Add ${ingredient.name} to your kitchen`}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${inKitchen ? "border-[#1a1a1a] bg-[#1a1a1a] text-white" : "border-black/20 text-black/60 hover:border-black/50"}`}
                      >
                        {inKitchen ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Plus aria-hidden="true" className="h-3.5 w-3.5" />}
                      </button>
                    </span>
                  </th>
                  {MONTHS.map((month, index) => {
                    const active = isAvailableInMonth(ingredient, index);
                    return (
                      <td key={month} className={`px-[2px] ${index === CURRENT_MONTH ? "bg-[#b5401f]/[0.07]" : ""}`}>
                        <span className="sr-only">{active ? `${month}: available` : `${month}: not marked`}</span>
                        <span
                          aria-hidden="true"
                          className="block h-7 rounded-sm"
                          style={{ backgroundColor: active ? ingredient.color : "transparent", opacity: active ? 0.85 : 1 }}
                        />
                      </td>
                    );
                  })}
                </Motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 max-w-3xl rounded-2xl border border-dashed border-black/20 p-5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/60">Availability not yet sourced</h3>
        <p className="mt-2 text-sm leading-relaxed text-black/75">{unsourced.map((item) => item.name).join(", ")}</p>
        <p className="mt-2 text-xs leading-relaxed text-black/65">
          These are not on the Oregon chart, so no months are shown rather than estimated ones. The chart is a 2017 planning aid for schools; it does not separate fresh harvest from storage, and timing varies by farm and year.
        </p>
      </div>
    </section>
  );
}
