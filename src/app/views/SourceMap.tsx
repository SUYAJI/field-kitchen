import { useEffect, useMemo, useState } from "react";
import { motion as Motion, AnimatePresence, useReducedMotion } from "motion/react";
import { INGREDIENTS, Region, SourceLayer, Ingredient, SUPPORTED_SOURCE_LAYERS } from "../data";

const LAYER_CONFIG: Record<SourceLayer, { radius: number; jitterScale: number; inset: number; labelTop: number; color: string }> = {
  Local: { radius: 12, jitterScale: 0.3, inset: 38, labelTop: 40, color: '#2a9d8f' },
  Regional: { radius: 28, jitterScale: 0.3, inset: 22, labelTop: 24, color: '#f4a261' },
  Imported: { radius: 35, jitterScale: 0.25, inset: 15, labelTop: 17, color: '#bc6c25' },
  'Wild Foraged': { radius: 42, jitterScale: 0.2, inset: 8, labelTop: 10, color: '#606c38' },
};
const HABITAT_MAP: Record<string, string> = {
  'Forest Floor': 'Temperate old-growth understory, damp soil and duff layer',
  'Subalpine Scrub': 'High-elevation shrubland, volcanic soils, seasonal snowmelt',
  'Riparian Zone': 'Streamside corridors, nutrient-rich alluvial deposits',
  'Valley Orchard': 'Lowland cultivation, loam soils of the Willamette basin',
  'Volcanic Soil': 'Rich mineral content from Cascade volcanic deposits',
  'Cool Soil': 'Maritime-cooled growing zones, consistent moisture',
  'Canopy Layer': 'Upper forest canopy, Douglas fir and western red cedar stands',
  'Coastal Tide': 'Intertidal zone, nutrient-dense cold Pacific waters',
};

export function SourceMap({ activeRegion }: { activeRegion: Region | "All" }) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredIngredient, setHoveredIngredient] = useState<Ingredient | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const activeIngredient = hoveredIngredient ?? selectedIngredient;

  const filteredIngredients = useMemo(() => {
    return INGREDIENTS.filter(
      (item) => activeRegion === "All" || item.region.includes(activeRegion as Region)
    );
  }, [activeRegion]);

  const activeLayers = useMemo(() => {
    return SUPPORTED_SOURCE_LAYERS.filter((layer) =>
      filteredIngredients.some((ingredient) => ingredient.sourceLayer === layer)
    );
  }, [filteredIngredients]);

  const ingredientsByLayer = useMemo(() => {
    return activeLayers.reduce((acc, layer) => {
      acc[layer] = filteredIngredients.filter(i => i.sourceLayer === layer);
      return acc;
    }, {} as Partial<Record<SourceLayer, typeof INGREDIENTS>>);
  }, [activeLayers, filteredIngredients]);

  useEffect(() => {
    if (hoveredIngredient && !filteredIngredients.some((ingredient) => ingredient.id === hoveredIngredient.id)) {
      setHoveredIngredient(null);
    }
    if (selectedIngredient && !filteredIngredients.some((ingredient) => ingredient.id === selectedIngredient.id)) {
      setSelectedIngredient(null);
    }
  }, [filteredIngredients, hoveredIngredient, selectedIngredient]);

  // Stable positions based on ingredient id
  const getPosition = (ingredient: Ingredient, layer: SourceLayer, index: number, total: number) => {
    const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
    // Seed-based offset from id
    const seed = ingredient.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const jitter = ((seed % 20) - 10) * 0.5;
    
    const layerConfig = LAYER_CONFIG[layer];
    const radius = layerConfig.radius + jitter * layerConfig.jitterScale;

    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <section aria-labelledby="source-map-heading" className="w-full min-h-0 flex flex-col p-5 sm:p-6 lg:p-10 relative overflow-visible lg:h-full lg:overflow-x-hidden lg:overflow-y-auto">
      <header className="mb-6 lg:mb-8 relative z-20 shrink-0">
        <Motion.h2 
          id="source-map-heading"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-['Playfair_Display'] text-4xl md:text-6xl font-semibold tracking-[-0.02em] text-[#1a1a1a]"
        >
          Source Map
        </Motion.h2>
        <span className="text-[10px] uppercase font-semibold tracking-widest text-black/40">
          Geographic & Foraging Proximity Diagram
        </span>
      </header>

      {/* Legend */}
      <div className="relative z-20 flex flex-wrap gap-4 sm:gap-6 mb-5 lg:mb-6 text-[10px] uppercase tracking-widest font-semibold text-black/45 shrink-0">
        {activeLayers.map((layer) => (
          <div key={layer} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: LAYER_CONFIG[layer].color }} />
            {layer}
          </div>
        ))}
      </div>

      <div className="relative flex-none min-h-[340px] sm:min-h-[460px] lg:min-h-[280px] min-[1360px]:min-h-[440px] w-full flex items-center justify-center p-2 sm:p-4">
        <div className="relative w-full max-w-[700px] aspect-square lg:w-[280px] min-[1360px]:w-[440px]">
          
          {/* Concentric rings */}
          {activeLayers.map((layer) => (
            <div
              key={`ring-${layer}`}
              className="absolute rounded-full border border-black/[0.06]"
              style={{ inset: `${LAYER_CONFIG[layer].inset}%` }}
            />
          ))}
          
          {/* Layer labels */}
          {activeLayers.map((layer) => (
            <div
              key={`label-${layer}`}
              className={`absolute left-1/2 -translate-x-1/2 text-[10px] uppercase font-semibold tracking-[0.2em] ${layer === 'Wild Foraged' ? 'text-[#606c38]/60 border border-[#606c38]/20 px-3 py-0.5 rounded-full bg-[#606c38]/[0.03]' : 'text-black/50'}`}
              style={{ top: `${LAYER_CONFIG[layer].labelTop}%` }}
            >
              {layer}
            </div>
          ))}

          {/* Ingredient Nodes */}
          {activeLayers.map((layer) => {
            const items = ingredientsByLayer[layer] ?? [];
            return items.map((ingredient, i) => {
              const pos = getPosition(ingredient, layer, i, items.length);
              const isActive = activeIngredient?.id === ingredient.id;
              
              return (
                <Motion.button
                  type="button"
                  key={ingredient.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.2 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  onMouseEnter={() => setHoveredIngredient(ingredient)}
                  onMouseLeave={() => setHoveredIngredient(null)}
                  onFocus={() => setHoveredIngredient(ingredient)}
                  onBlur={() => setHoveredIngredient(null)}
                  onClick={() => setSelectedIngredient(selectedIngredient?.id === ingredient.id ? null : ingredient)}
                  aria-pressed={selectedIngredient?.id === ingredient.id}
                  aria-label={`${ingredient.name}. ${ingredient.sourceLayer} source from ${ingredient.originTag}, ${ingredient.region.join(', ')}. Select for habitat details.`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center justify-center gap-1.5 z-10 min-w-11 min-h-11 bg-transparent border-0 p-0"
                >
                  <Motion.div
                    animate={shouldReduceMotion ? undefined : { y: [0, -4, 4, 0] }}
                    transition={shouldReduceMotion ? undefined : { duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <Motion.div 
                      animate={{ scale: isActive ? 1.8 : 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-3.5 h-3.5 md:w-5 md:h-5 rounded-full shadow-lg border-2 border-white/60"
                      style={{ backgroundColor: ingredient.color }}
                    />
                    <span className={`font-['Space_Grotesk'] text-[10px] tracking-widest uppercase font-semibold whitespace-nowrap bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded-sm transition-all duration-300 ${isActive ? 'text-black bg-white shadow-md' : 'text-black/65'}`}>
                      {ingredient.name}
                    </span>
                  </Motion.div>

                  {/* Habitat Context Tooltip */}
                  <AnimatePresence>
                    {isActive && (
                      <Motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="absolute top-full mt-2 w-52 bg-white/95 backdrop-blur-xl border border-black/10 rounded-xl p-3 shadow-xl z-50 pointer-events-none"
                      >
                        <div className="text-[9px] uppercase tracking-widest font-semibold text-black/40 mb-1.5">{ingredient.originTag}</div>
                        <p className="text-[11px] text-black/60 leading-relaxed">{HABITAT_MAP[ingredient.originTag] || 'Pacific Northwest bioregion'}</p>
                        <div className="flex gap-2 mt-2 text-[8px] uppercase tracking-widest font-semibold text-black/30">
                          <span>{ingredient.sourceLayer}</span>
                          <span>·</span>
                          <span>{ingredient.region[0]}</span>
                        </div>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </Motion.button>
              );
            });
          })}
        </div>
      </div>
    </section>
  );
}
