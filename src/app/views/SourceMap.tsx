import { useEffect, useMemo, useState } from "react";
import { motion as Motion, AnimatePresence, useReducedMotion } from "motion/react";
import { INGREDIENTS, Region, SourceLayer, Ingredient, SUPPORTED_SOURCE_LAYERS } from "../data";

const LAYER_CONFIG: Record<SourceLayer, { radius: number; jitterScale: number; inset: number; color: string }> = {
  Local: { radius: 18, jitterScale: 0.3, inset: 32, color: '#2a9d8f' },
  Regional: { radius: 28, jitterScale: 0.3, inset: 22, color: '#f4a261' },
  Imported: { radius: 35, jitterScale: 0.25, inset: 15, color: '#bc6c25' },
  'Wild Foraged': { radius: 42, jitterScale: 0.2, inset: 8, color: '#606c38' },
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

function getRadialLabelPlacement(x: number, y: number) {
  const horizontal = x - 50;
  const vertical = y - 50;

  if (Math.abs(horizontal) > Math.abs(vertical)) {
    return horizontal > 0
      ? 'left-full top-1/2 ml-1 -translate-y-1/2'
      : 'right-full top-1/2 mr-1 -translate-y-1/2';
  }

  return vertical > 0
    ? 'left-1/2 top-full mt-1 -translate-x-1/2'
    : 'bottom-full left-1/2 mb-1 -translate-x-1/2';
}

function getLayerLabelPosition(layer: SourceLayer) {
  const angle = -Math.PI * 0.75;
  const radius = LAYER_CONFIG[layer].radius;
  return {
    left: `${50 + Math.cos(angle) * radius}%`,
    top: `${50 + Math.sin(angle) * radius}%`,
  };
}

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
              className={`absolute z-[5] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] uppercase font-semibold tracking-[0.18em] ${layer === 'Wild Foraged' ? 'text-[#606c38]/60 border border-[#606c38]/20 px-2.5 py-0.5 rounded-full bg-[#faf9f6]/80' : 'text-black/50 bg-[#faf9f6]/80 px-1'}`}
              style={getLayerLabelPosition(layer)}
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
              const labelPlacement = getRadialLabelPlacement(pos.x, pos.y);
              
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
                  className="absolute z-10 flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                >
                  <Motion.div
                    animate={shouldReduceMotion ? undefined : { y: [0, -4, 4, 0] }}
                    transition={shouldReduceMotion ? undefined : { duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex h-11 w-11 items-center justify-center"
                  >
                    <Motion.div 
                      animate={{ scale: isActive ? 1.8 : 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-3.5 h-3.5 md:w-5 md:h-5 rounded-full shadow-lg border-2 border-white/60"
                      style={{ backgroundColor: ingredient.color }}
                    />
                    <span
                      className={`absolute ${labelPlacement} hidden whitespace-nowrap rounded-sm bg-white/80 px-2 py-0.5 font-['Space_Grotesk'] text-[10px] font-semibold uppercase tracking-widest backdrop-blur-sm transition-all duration-300 sm:block ${isActive ? 'text-black bg-white shadow-md' : 'text-black/65'}`}
                    >
                      {ingredient.name}
                    </span>
                  </Motion.div>

                </Motion.button>
              );
            });
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:hidden">
        {filteredIngredients.map((ingredient) => (
          <div key={ingredient.id} className="flex min-w-0 items-center gap-2 rounded-lg border border-black/5 bg-white/55 px-2.5 py-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: ingredient.color }} />
            <span className="truncate text-[9px] font-semibold uppercase tracking-wider text-black/60">{ingredient.name}</span>
          </div>
        ))}
      </div>

      {/* Selected habitat detail stays outside the dense radial field. */}
      <AnimatePresence>
        {activeIngredient && (
          <Motion.div
            key={activeIngredient.id}
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative z-20 mx-auto mt-3 w-full max-w-sm rounded-xl border border-black/10 bg-white/95 p-3 shadow-xl backdrop-blur-xl pointer-events-none lg:absolute lg:right-10 lg:top-[54%] lg:mx-0 lg:mt-0 lg:w-52"
          >
            <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-widest text-black/40">{activeIngredient.originTag}</div>
            <p className="text-[11px] leading-relaxed text-black/60">{HABITAT_MAP[activeIngredient.originTag] || 'Pacific Northwest bioregion'}</p>
            <div className="mt-2 flex gap-2 text-[8px] font-semibold uppercase tracking-widest text-black/30">
              <span>{activeIngredient.sourceLayer}</span>
              <span>·</span>
              <span>{activeIngredient.region[0]}</span>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
