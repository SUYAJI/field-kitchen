import { useMemo, useState } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { INGREDIENTS, Region, SourceLayer, Ingredient } from "../data";

const LAYERS: SourceLayer[] = ['Local', 'Regional', 'Wild Foraged'];
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
  const [hoveredIngredient, setHoveredIngredient] = useState<Ingredient | null>(null);

  const filteredIngredients = useMemo(() => {
    return INGREDIENTS.filter(
      (item) => activeRegion === "All" || item.region.includes(activeRegion as Region)
    );
  }, [activeRegion]);

  const ingredientsByLayer = useMemo(() => {
    return LAYERS.reduce((acc, layer) => {
      acc[layer] = filteredIngredients.filter(i => i.sourceLayer === layer);
      return acc;
    }, {} as Record<SourceLayer, typeof INGREDIENTS>);
  }, [filteredIngredients]);

  // Stable positions based on ingredient id
  const getPosition = (ingredient: Ingredient, layer: SourceLayer, index: number, total: number) => {
    const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
    // Seed-based offset from id
    const seed = ingredient.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const jitter = ((seed % 20) - 10) * 0.5;
    
    let radius: number;
    if (layer === 'Local') radius = 12 + jitter * 0.3;
    else if (layer === 'Regional') radius = 28 + jitter * 0.3;
    else radius = 42 + jitter * 0.2; // Wild Foraged outer

    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 relative overflow-hidden">
      <header className="mb-8 relative z-20 shrink-0">
        <Motion.h2 
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
      <div className="relative z-20 flex gap-6 mb-6 text-[10px] uppercase tracking-widest font-semibold text-black/30 shrink-0">
        {LAYERS.map((layer) => (
          <div key={layer} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${layer === 'Local' ? 'bg-[#2a9d8f]' : layer === 'Regional' ? 'bg-[#f4a261]' : 'bg-[#606c38]'}`} />
            {layer}
          </div>
        ))}
      </div>

      <main className="relative flex-1 w-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-[700px] aspect-square">
          
          {/* Concentric rings */}
          <div className="absolute inset-[8%] rounded-full border border-black/[0.06]" />
          <div className="absolute inset-[22%] rounded-full border border-black/[0.06]" />
          <div className="absolute inset-[38%] rounded-full border border-black/[0.06]" />
          
          {/* Layer labels */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 text-[9px] uppercase font-semibold tracking-[0.2em] text-black/15">Local</div>
          <div className="absolute top-[24%] left-1/2 -translate-x-1/2 text-[9px] uppercase font-semibold tracking-[0.2em] text-black/15">Regional</div>
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-[9px] uppercase font-semibold tracking-[0.2em] text-[#606c38]/30 border border-[#606c38]/10 px-3 py-0.5 rounded-full bg-[#606c38]/[0.03]">Wild Foraged</div>

          {/* Ingredient Nodes */}
          {LAYERS.map((layer) => {
            const items = ingredientsByLayer[layer];
            return items.map((ingredient, i) => {
              const pos = getPosition(ingredient, layer, i, items.length);
              const isHovered = hoveredIngredient?.id === ingredient.id;
              
              return (
                <Motion.div
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
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center gap-1.5 z-10"
                >
                  <Motion.div
                    animate={{ y: [0, -4, 4, 0] }}
                    transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <Motion.div 
                      animate={{ scale: isHovered ? 1.8 : 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-3.5 h-3.5 md:w-5 md:h-5 rounded-full shadow-lg border-2 border-white/60"
                      style={{ backgroundColor: ingredient.color }}
                    />
                    <span className={`font-['Space_Grotesk'] text-[9px] md:text-[10px] tracking-widest uppercase font-semibold whitespace-nowrap bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded-sm transition-all duration-300 ${isHovered ? 'text-black bg-white shadow-md' : 'text-black/50'}`}>
                      {ingredient.name}
                    </span>
                  </Motion.div>

                  {/* Habitat Context Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
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
                </Motion.div>
              );
            });
          })}
        </div>
      </main>
    </div>
  );
}
