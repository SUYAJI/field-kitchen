import { useState, useMemo, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { INGREDIENTS, Ingredient, MONTH_INITIALS, MONTHS, SEASONS, Season, Region } from "../data";
import { X, Calendar } from "lucide-react";

export function SeasonalMap({ activeRegion }: { activeRegion: Region | "All" }) {
  const [activeSeason, setActiveSeason] = useState<Season | "All">("All");
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<Ingredient | null>(null);
  const [sweepMonth, setSweepMonth] = useState(0);

  // Animated time sweep
  useEffect(() => {
    const interval = setInterval(() => {
      setSweepMonth(prev => (prev + 1) % 12);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="w-full min-h-0 flex flex-col p-5 sm:p-6 lg:p-10 relative overflow-visible lg:h-full lg:overflow-hidden">
      <header className="mb-6 lg:mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-5 lg:gap-6 shrink-0">
        <div className="flex flex-col gap-2">
          <Motion.h2 
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

        <div className="flex flex-wrap gap-2 text-[10px] uppercase font-semibold tracking-widest">
          <button
            onClick={() => setActiveSeason("All")}
            className={`px-4 py-2 border rounded-full transition-all duration-300 ${activeSeason === "All" ? 'bg-black text-[#faf9f6] border-black' : 'border-black/10 text-black/50 hover:border-black/30'}`}
          >
            Full Year
          </button>
          {SEASONS.map(s => (
            <button
              key={s}
              onClick={() => setActiveSeason(s)}
              className={`px-4 py-2 border rounded-full transition-all duration-300 ${activeSeason === s ? 'bg-black text-[#faf9f6] border-black' : 'border-black/10 text-black/50 hover:border-black/30'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <main className="w-full overflow-x-auto overflow-y-visible relative pb-4 overscroll-x-contain lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:pb-0">
        <div className="min-w-[800px] w-full relative">
          {/* Months Header */}
          <div className="grid grid-cols-[200px_repeat(12,minmax(0,1fr))] gap-2 mb-4 text-[10px] uppercase tracking-widest font-semibold text-black/30 border-b border-black/10 pb-4 sticky top-0 bg-[#faf9f6]/80 backdrop-blur-md z-20">
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
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-[#e76f51]/40 rounded-full -ml-[5px] -mt-1 blur-[2px]"
            />
          </div>

          {/* Timeline Rows */}
          <div className="space-y-2 pb-20">
            {filteredIngredients.map((ingredient, idx) => {
              const isHovered = hoveredIngredient === ingredient.id;
              return (
                <Motion.div 
                  key={ingredient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                  onMouseEnter={() => setHoveredIngredient(ingredient.id)}
                  onMouseLeave={() => setHoveredIngredient(null)}
                  onClick={() => setSelectedDetail(ingredient)}
                  className={`grid grid-cols-[200px_repeat(12,minmax(0,1fr))] gap-1 md:gap-2 items-center cursor-pointer rounded-xl transition-all duration-300 py-1 px-1 ${isHovered ? 'bg-white/60 shadow-sm' : 'hover:bg-white/30'}`}
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
                </Motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedDetail && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 left-4 right-4 max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white/90 backdrop-blur-2xl border border-black/10 rounded-2xl p-5 shadow-2xl z-[100] md:absolute md:left-auto md:right-10 md:bottom-10 md:w-[400px] md:max-h-none md:overflow-visible md:p-6 md:z-50"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-['Playfair_Display'] text-3xl font-semibold">{selectedDetail.name}</h3>
                <span className="text-[10px] uppercase tracking-widest text-black/40 font-semibold">{selectedDetail.originTag} — {selectedDetail.region[0]}</span>
              </div>
              <button onClick={() => setSelectedDetail(null)} className="p-1.5 hover:bg-black/5 rounded-full">
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
                <div className="flex justify-between text-[8px] uppercase tracking-widest text-black/25 mt-1 px-0.5">
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
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
