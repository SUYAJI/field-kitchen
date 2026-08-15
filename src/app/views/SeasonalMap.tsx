import { useState, useMemo, useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence, useReducedMotion } from "motion/react";
import { INGREDIENTS, Ingredient, MONTH_INITIALS, MONTHS, SEASONS, Season, Region } from "../data";
import { X, Calendar } from "lucide-react";
import { useMediaQuery, useOverlayFocus } from "../accessibility";

export function SeasonalMap({ activeRegion }: { activeRegion: Region | "All" }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeSeason, setActiveSeason] = useState<Season | "All">("All");
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<Ingredient | null>(null);
  const [sweepMonth, setSweepMonth] = useState(0);
  const [isSweepPaused, setIsSweepPaused] = useState(false);
  const detailPanelRef = useRef<HTMLElement>(null);
  const detailCloseRef = useRef<HTMLButtonElement>(null);
  const detailTriggerRef = useRef<HTMLElement | null>(null);
  const isModalDetail = useMediaQuery("(max-width: 767px)");

  useOverlayFocus({
    open: Boolean(selectedDetail),
    containerRef: detailPanelRef,
    initialFocusRef: detailCloseRef,
    restoreFocusRef: detailTriggerRef,
    onClose: () => setSelectedDetail(null),
    trapFocus: isModalDetail,
  });

  // Animated time sweep
  useEffect(() => {
    if (shouldReduceMotion || isSweepPaused) return;
    const interval = setInterval(() => {
      setSweepMonth(prev => (prev + 1) % 12);
    }, 2000);
    return () => clearInterval(interval);
  }, [isSweepPaused, shouldReduceMotion]);

  const filteredIngredients = useMemo(() => {
    return INGREDIENTS.filter((item) => {
      const matchRegion = activeRegion === "All" || item.region.includes(activeRegion as Region);
      const matchSeason = activeSeason === "All" || item.seasons.includes(activeSeason);
      return matchRegion && matchSeason;
    });
  }, [activeRegion, activeSeason]);

  useEffect(() => {
    const visibleIds = new Set(filteredIngredients.map((ingredient) => ingredient.id));

    if (hoveredIngredient && !visibleIds.has(hoveredIngredient)) {
      setHoveredIngredient(null);
    }
    if (selectedDetail && !visibleIds.has(selectedDetail.id)) {
      setSelectedDetail(null);
    }
  }, [filteredIngredients, hoveredIngredient, selectedDetail]);

  return (
    <section aria-labelledby="seasonal-map-heading" className="w-full min-h-0 flex flex-col p-5 sm:p-6 lg:p-10 relative overflow-visible lg:h-full lg:overflow-hidden">
      <header className="mb-6 lg:mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-5 lg:gap-6 shrink-0">
        <div className="flex flex-col gap-2">
          <Motion.h2 
            id="seasonal-map-heading"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-['Playfair_Display'] text-4xl md:text-6xl font-semibold tracking-[-0.02em] text-[#1a1a1a]"
          >
            Seasonal Map
          </Motion.h2>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-black/40">
            Harvest Windows & Temporal Alignment
          </span>
        </div>

        <div role="group" aria-label="Filter ingredients by season" className="flex flex-wrap gap-2 text-[10px] uppercase font-semibold tracking-widest">
          <button
            type="button"
            onClick={() => { setActiveSeason("All"); setIsSweepPaused(true); }}
            aria-pressed={activeSeason === "All"}
            className={`px-4 py-2 border rounded-full transition-all duration-300 min-h-11 ${activeSeason === "All" ? 'bg-black text-[#faf9f6] border-black' : 'border-black/10 text-black/50 hover:border-black/30'}`}
          >
            Full Year
          </button>
          {SEASONS.map(s => (
            <button
              type="button"
              key={s}
              onClick={() => { setActiveSeason(s); setIsSweepPaused(true); }}
              aria-pressed={activeSeason === s}
              className={`px-4 py-2 border rounded-full transition-all duration-300 min-h-11 ${activeSeason === s ? 'bg-black text-[#faf9f6] border-black' : 'border-black/10 text-black/50 hover:border-black/30'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <div onFocusCapture={() => setIsSweepPaused(true)} onPointerDown={() => setIsSweepPaused(true)} onMouseEnter={() => setIsSweepPaused(true)} className="w-full overflow-x-auto overflow-y-visible relative pb-4 overscroll-x-contain lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:pb-0">
        <div className="min-w-[800px] w-full relative">
          {/* Months Header */}
          <div className="grid grid-cols-[200px_repeat(12,minmax(0,1fr))] gap-2 mb-4 text-[10px] uppercase tracking-widest font-semibold text-black/45 border-b border-black/10 pb-4 sticky top-0 bg-[#faf9f6]/80 backdrop-blur-md z-20">
            <div className="pl-4">Ingredient</div>
            {MONTHS.map((m, i) => (
              <div key={m} className={`text-center transition-colors duration-300 ${sweepMonth === i ? 'text-[#e76f51]' : ''}`}>
                {m}
              </div>
            ))}
          </div>

          {/* Time Sweep Indicator */}
          <div 
            className="absolute top-0 bottom-0 w-[1px] bg-[#e76f51]/30 z-10 pointer-events-none transition-all duration-[1800ms] ease-linear"
            style={{ left: `calc(200px + (100% - 200px) * ${(sweepMonth + 0.5) / 12})` }}
          >
            <Motion.div
              animate={shouldReduceMotion || isSweepPaused ? { opacity: 0.5 } : { opacity: [0.3, 0.7, 0.3] }}
              transition={shouldReduceMotion || isSweepPaused ? { duration: 0 } : { duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-[#e76f51]/40 rounded-full -ml-[5px] -mt-1 blur-[2px]"
            />
          </div>

          {/* Timeline Rows */}
          <div className="space-y-2 pb-20">
            {filteredIngredients.map((ingredient, idx) => {
              const isHovered = hoveredIngredient === ingredient.id;
              return (
                <Motion.button
                  type="button"
                  key={ingredient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                  onMouseEnter={() => setHoveredIngredient(ingredient.id)}
                  onMouseLeave={() => setHoveredIngredient(null)}
                  onFocus={() => setHoveredIngredient(ingredient.id)}
                  onBlur={() => setHoveredIngredient(null)}
                  onClick={(event) => {
                    detailTriggerRef.current = event.currentTarget;
                    setSelectedDetail(ingredient);
                    setIsSweepPaused(true);
                  }}
                  aria-expanded={selectedDetail?.id === ingredient.id}
                  aria-controls="seasonal-detail-panel"
                  aria-label={`${ingredient.name}, harvest window ${MONTHS[ingredient.harvestWindow[0]]} through ${MONTHS[ingredient.harvestWindow[1]]}. Open seasonal details.`}
                  className={`grid grid-cols-[200px_repeat(12,minmax(0,1fr))] w-full min-h-11 text-left gap-1 md:gap-2 items-center cursor-pointer rounded-xl transition-all duration-300 py-1 px-1 ${isHovered ? 'bg-white/60 shadow-sm' : 'hover:bg-white/30'}`}
                >
                  <div className={`font-['Playfair_Display'] text-lg md:text-2xl pl-3 transition-all duration-300 ${isHovered ? 'text-[#1a1a1a] translate-x-1' : 'text-[#1a1a1a]/70'}`}>
                    {ingredient.name}
                  </div>
                  
                  {[...Array(12)].map((_, monthIdx) => {
                    const [start, end] = ingredient.harvestWindow;
                    const isActive = start <= end 
                      ? monthIdx >= start && monthIdx <= end
                      : monthIdx >= start || monthIdx <= end;

                    return (
                      <div key={monthIdx} className="h-8 md:h-10 flex items-center justify-center p-[1px]">
                        <Motion.div
                          className="w-full h-full rounded-sm"
                          animate={{
                            backgroundColor: isActive ? ingredient.color : 'rgba(0,0,0,0)',
                            opacity: isActive ? (isHovered ? 1 : 0.7) : 0,
                            scaleY: isActive && isHovered ? 1.2 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    );
                  })}
                </Motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedDetail && (
          <Motion.aside
            id="seasonal-detail-panel"
            ref={detailPanelRef}
            role={isModalDetail ? "dialog" : "complementary"}
            aria-modal={isModalDetail ? "true" : undefined}
            aria-labelledby="seasonal-detail-title"
            tabIndex={-1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 left-4 right-4 max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white/90 backdrop-blur-2xl border border-black/10 rounded-2xl p-5 shadow-2xl z-[100] md:absolute md:left-auto md:right-10 md:bottom-10 md:w-[400px] md:max-h-none md:overflow-visible md:p-6 md:z-50"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 id="seasonal-detail-title" className="font-['Playfair_Display'] text-3xl font-semibold">{selectedDetail.name}</h3>
                <span className="text-[10px] uppercase tracking-widest text-black/40 font-semibold">{selectedDetail.originTag} — {selectedDetail.region[0]}</span>
              </div>
              <button ref={detailCloseRef} type="button" aria-label="Close seasonal details" onClick={() => setSelectedDetail(null)} className="p-1.5 hover:bg-black/5 rounded-full min-w-11 min-h-11 flex items-center justify-center">
                <X className="w-4 h-4 text-black/40" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-[9px] uppercase tracking-widest font-semibold text-black/40 mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Harvest Timeline
                </div>
                <div className="flex gap-[2px] h-5 rounded-full overflow-hidden bg-black/5">
                  {[...Array(12)].map((_, i) => {
                    const [s, e] = selectedDetail.harvestWindow;
                    const isActive = s <= e ? i >= s && i <= e : i >= s || i <= e;
                    return (
                      <div key={i} className="flex-1 h-full rounded-sm" style={{ backgroundColor: isActive ? selectedDetail.color : 'transparent', opacity: isActive ? 0.9 : 0 }} />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] uppercase tracking-widest text-black/45 mt-1 px-0.5">
                  {MONTHS.map((month, index) => <span key={month}>{MONTH_INITIALS[index]}</span>)}
                </div>
              </div>
              <div className="flex gap-3 text-[10px] uppercase tracking-widest font-semibold text-black/50">
                <span>Seasons: {selectedDetail.seasons.join(', ')}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {selectedDetail.pairings.map(p => (
                  <span key={p} className="px-2 py-1 bg-black/5 rounded-full text-[10px] text-black/60">{p}</span>
                ))}
              </div>
            </div>
          </Motion.aside>
        )}
      </AnimatePresence>
    </section>
  );
}
