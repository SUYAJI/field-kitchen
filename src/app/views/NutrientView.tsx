import { useEffect, useMemo, useState } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { INGREDIENTS, Region, Ingredient, NUTRIENT_METRICS, NutrientKey, PROTOTYPE_INDEX_RANGES } from "../data";

const METRIC_COLORS: Record<NutrientKey, string> = {
  protein: '#e76f51',
  mineral: '#2a9d8f',
  fiber: '#f4a261',
  digestibility: '#e9c46a',
};

const METRICS = NUTRIENT_METRICS.map((metric) => ({
  ...metric,
  color: METRIC_COLORS[metric.key],
}));

export function NutrientView({ activeRegion }: { activeRegion: Region | "All" }) {
  const [activeMetric, setActiveMetric] = useState<NutrientKey>('protein');
  const [hoveredNode, setHoveredNode] = useState<Ingredient | null>(null);

  const filteredIngredients = useMemo(() => {
    return INGREDIENTS.filter(
      (item) => activeRegion === "All" || item.region.includes(activeRegion as Region)
    );
  }, [activeRegion]);

  useEffect(() => {
    if (hoveredNode && !filteredIngredients.some((ingredient) => ingredient.id === hoveredNode.id)) {
      setHoveredNode(null);
    }
  }, [filteredIngredients, hoveredNode]);

  const currentMetricConfig = METRICS.find(m => m.key === activeMetric)!;

  // Compute positions based on active metric - sorted by metric value, arranged in a radial pattern
  const sortedIngredients = useMemo(() => {
    return [...filteredIngredients].sort((a, b) => b.nutrients[activeMetric] - a.nutrients[activeMetric]);
  }, [filteredIngredients, activeMetric]);

  // Stable position calculation
  const getPosition = (ingredient: Ingredient, index: number, total: number) => {
    const value = ingredient.nutrients[activeMetric];
    // Higher value = closer to center
    const normalizedDistance = 1 - (value / PROTOTYPE_INDEX_RANGES.nutrientMetrics.max);
    const radius = 10 + normalizedDistance * 35; // 10% to 45% from center
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const seed = ingredient.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const jitter = ((seed % 10) - 5) * 0.5;
    
    return {
      x: 50 + Math.cos(angle) * (radius + jitter),
      y: 50 + Math.sin(angle) * (radius + jitter),
    };
  };

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 relative overflow-hidden">
      <header className="mb-6 relative z-20 shrink-0">
        <Motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-['Playfair_Display'] text-4xl md:text-6xl font-semibold tracking-[-0.02em] text-[#1a1a1a]"
        >
          Nutrient View
        </Motion.h2>
        <span className="text-[10px] uppercase font-semibold tracking-widest text-black/40">
          Macro & Micronutrient Relationships
        </span>
      </header>

      {/* Metric Switcher */}
      <div className="relative z-20 flex flex-wrap gap-2 mb-6 shrink-0">
        {METRICS.map((metric) => (
          <button
            key={metric.key}
            onClick={() => setActiveMetric(metric.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] uppercase tracking-widest font-semibold transition-all duration-500 ${
              activeMetric === metric.key
                ? 'border-black/30 shadow-sm'
                : 'border-black/10 text-black/40 hover:border-black/20'
            }`}
            style={activeMetric === metric.key ? { backgroundColor: metric.color + '15', color: metric.color, borderColor: metric.color + '40' } : {}}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }} />
            {metric.label}
          </button>
        ))}
      </div>

      {/* Radial Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <Motion.div
          key={activeMetric}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full blur-[100px]"
          style={{ backgroundColor: currentMetricConfig.color }}
        />
      </div>

      {/* Concentric rings */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="relative w-[80%] max-w-[700px] aspect-square">
          {[0.3, 0.55, 0.8].map((scale, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-black/[0.04]"
              style={{ inset: `${(1 - scale) * 50}%` }}
            />
          ))}
        </div>
      </div>

      {/* Ingredient Nodes */}
      <div className="relative flex-1 z-10 flex items-center justify-center">
        <div className="relative w-full max-w-[700px] aspect-square">
          {sortedIngredients.map((ingredient, i) => {
            const pos = getPosition(ingredient, i, sortedIngredients.length);
            const value = ingredient.nutrients[activeMetric];
            const isHovered = hoveredNode?.id === ingredient.id;
            const nodeSize = 12 + (value / PROTOTYPE_INDEX_RANGES.nutrientMetrics.max) * 20; // 12px to 32px

            return (
              <Motion.div
                key={ingredient.id}
                animate={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  scale: isHovered ? 1.2 : 1,
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                onMouseEnter={() => setHoveredNode(ingredient)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="flex flex-col items-center gap-2">
                  <Motion.div
                    animate={{ y: [0, -3, 3, 0] }}
                    transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div 
                      className="rounded-full border-2 border-white/60 shadow-lg transition-all duration-300"
                      style={{ 
                        backgroundColor: ingredient.color,
                        width: nodeSize,
                        height: nodeSize,
                        boxShadow: isHovered ? `0 0 20px ${ingredient.color}60` : undefined,
                      }}
                    />
                    <span className={`font-['Space_Grotesk'] text-[9px] md:text-[10px] tracking-widest uppercase font-semibold bg-white/80 backdrop-blur-md px-2 py-0.5 rounded border border-black/5 transition-all duration-300 whitespace-nowrap ${isHovered ? 'text-black shadow-md' : 'text-black/50'}`}>
                      {ingredient.name}
                    </span>
                    {/* Value badge */}
                    <span 
                      className="text-[9px] font-semibold tabular-nums px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: currentMetricConfig.color + '20', color: currentMetricConfig.color }}
                    >
                      {value}
                    </span>
                  </Motion.div>

                  {/* Hover Detail */}
                  <AnimatePresence>
                    {isHovered && (
                      <Motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full mt-3 w-44 bg-white/95 backdrop-blur-xl border border-black/10 rounded-xl p-3 shadow-xl pointer-events-none z-50"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {METRICS.map((m) => (
                            <div key={m.key} className="flex flex-col">
                              <span className="text-[8px] uppercase tracking-widest font-semibold text-black/40">{m.label.split(' ')[0]}</span>
                              <div className="flex items-center gap-1 mt-1">
                                <div className="flex-1 h-1 bg-black/5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${(ingredient.nutrients[m.key] / PROTOTYPE_INDEX_RANGES.nutrientMetrics.max) * 100}%`,
                                      backgroundColor: m.color,
                                    }}
                                  />
                                </div>
                                <span className="text-[9px] font-semibold tabular-nums">{ingredient.nutrients[m.key]}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
