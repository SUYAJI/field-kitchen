import { useEffect, useMemo, useState } from "react";
import { motion as Motion, AnimatePresence, useReducedMotion } from "motion/react";
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

function getRadialLabelPlacement(x: number, y: number) {
  const horizontal = x - 50;
  const vertical = y - 50;

  if (Math.abs(horizontal) > Math.abs(vertical)) {
    return horizontal > 0
      ? 'left-full top-1/2 ml-1 -translate-y-1/2 items-start'
      : 'right-full top-1/2 mr-1 -translate-y-1/2 items-end';
  }

  return vertical > 0
    ? 'left-1/2 top-full mt-1 -translate-x-1/2 items-center'
    : 'bottom-full left-1/2 mb-1 -translate-x-1/2 items-center';
}

export function NutrientView({ activeRegion }: { activeRegion: Region | "All" }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeMetric, setActiveMetric] = useState<NutrientKey>('protein');
  const [hoveredNode, setHoveredNode] = useState<Ingredient | null>(null);
  const [selectedNode, setSelectedNode] = useState<Ingredient | null>(null);
  const activeNode = hoveredNode ?? selectedNode;

  const filteredIngredients = useMemo(() => {
    return INGREDIENTS.filter(
      (item) => activeRegion === "All" || item.region.includes(activeRegion as Region)
    );
  }, [activeRegion]);

  useEffect(() => {
    if (hoveredNode && !filteredIngredients.some((ingredient) => ingredient.id === hoveredNode.id)) {
      setHoveredNode(null);
    }
    if (selectedNode && !filteredIngredients.some((ingredient) => ingredient.id === selectedNode.id)) {
      setSelectedNode(null);
    }
  }, [filteredIngredients, hoveredNode, selectedNode]);

  const currentMetricConfig = METRICS.find(m => m.key === activeMetric)!;

  // Rank nodes by the active metric and arrange them radially.
  const sortedIngredients = useMemo(() => {
    return [...filteredIngredients].sort((a, b) => b.nutrients[activeMetric] - a.nutrients[activeMetric]);
  }, [filteredIngredients, activeMetric]);

  const getPosition = (ingredient: Ingredient, index: number, total: number) => {
    const value = ingredient.nutrients[activeMetric];
    const normalizedDistance = 1 - (value / PROTOTYPE_INDEX_RANGES.nutrientMetrics.max);
    const radius = 10 + normalizedDistance * 35;
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const seed = ingredient.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const jitter = ((seed % 10) - 5) * 0.5;
    
    return {
      x: 50 + Math.cos(angle) * (radius + jitter),
      y: 50 + Math.sin(angle) * (radius + jitter),
    };
  };

  return (
    <section aria-labelledby="nutrient-view-heading" className="w-full min-h-0 flex flex-col p-5 sm:p-6 lg:p-10 relative overflow-visible lg:h-full lg:overflow-x-hidden lg:overflow-y-auto">
      <header className="mb-5 lg:mb-6 relative z-20 shrink-0">
        <Motion.h2 
          id="nutrient-view-heading"
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

      <div role="group" aria-label="Choose nutrient metric" className="relative z-20 flex flex-wrap gap-2 mb-5 lg:mb-6 shrink-0">
        {METRICS.map((metric) => (
          <button
            type="button"
            key={metric.key}
            onClick={() => setActiveMetric(metric.key)}
            aria-pressed={activeMetric === metric.key}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] uppercase tracking-widest font-semibold transition-all duration-500 min-h-11 ${
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

      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <Motion.div
          key={activeMetric}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={shouldReduceMotion ? { scale: 1, opacity: 0.1 } : { scale: [1, 1.05, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full blur-[100px]"
          style={{ backgroundColor: currentMetricConfig.color }}
        />
      </div>

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

      <div className="relative flex-none min-h-[400px] sm:min-h-[520px] lg:min-h-[280px] min-[1360px]:min-h-[440px] z-10 flex items-center justify-center">
        <div className="relative w-[calc(100%-2rem)] sm:w-full max-w-[700px] aspect-square lg:w-[280px] min-[1360px]:w-[440px]">
          {sortedIngredients.map((ingredient, i) => {
            const pos = getPosition(ingredient, i, sortedIngredients.length);
            const value = ingredient.nutrients[activeMetric];
            const isActive = activeNode?.id === ingredient.id;
            const nodeSize = 12 + (value / PROTOTYPE_INDEX_RANGES.nutrientMetrics.max) * 20;
            const labelPlacement = getRadialLabelPlacement(pos.x, pos.y);

            return (
              <Motion.button
                type="button"
                key={ingredient.id}
                animate={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  scale: isActive ? 1.2 : 1,
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ zIndex: isActive ? sortedIngredients.length + 10 : sortedIngredients.length - i }}
                className="absolute z-10 min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0"
                onMouseEnter={() => setHoveredNode(ingredient)}
                onMouseLeave={() => setHoveredNode(null)}
                onFocus={() => setHoveredNode(ingredient)}
                onBlur={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(selectedNode?.id === ingredient.id ? null : ingredient)}
                aria-pressed={selectedNode?.id === ingredient.id}
                aria-label={`${ingredient.name}. ${currentMetricConfig.label}: ${value}. Select for complete nutrient details.`}
              >
                <div className="flex items-center justify-center">
                  <Motion.div
                    animate={shouldReduceMotion ? undefined : { y: [0, -3, 3, 0] }}
                    transition={shouldReduceMotion ? undefined : { duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex h-11 w-11 items-center justify-center"
                  >
                    <div 
                      className="rounded-full border-2 border-white/60 shadow-lg transition-all duration-300"
                      style={{ 
                        backgroundColor: ingredient.color,
                        width: nodeSize,
                        height: nodeSize,
                        boxShadow: isActive ? `0 0 20px ${ingredient.color}60` : undefined,
                      }}
                    />
                    {isActive && (
                      <div className={`absolute ${labelPlacement} flex whitespace-nowrap transition-all duration-300`}>
                        <span className="rounded border border-black/5 bg-white/90 px-2 py-0.5 font-['Space_Grotesk'] text-[10px] font-semibold uppercase tracking-widest text-black shadow-md backdrop-blur-md">
                          {ingredient.name}
                        </span>
                        <span
                          className="mt-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold tabular-nums"
                          style={{ backgroundColor: currentMetricConfig.color + '20', color: currentMetricConfig.color }}
                        >
                          {value}
                        </span>
                      </div>
                    )}
                  </Motion.div>

                </div>
              </Motion.button>
            );
          })}
        </div>
      </div>

      <div className="relative z-20 grid grid-cols-2 gap-2 lg:absolute lg:left-10 lg:top-[54%] lg:w-[360px]">
        {sortedIngredients.map((ingredient) => (
          <div key={ingredient.id} className="flex min-w-0 items-center gap-2 rounded-lg border border-black/5 bg-white/55 px-2.5 py-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: ingredient.color }} />
            <span className="min-w-0 flex-1 truncate text-[9px] font-semibold uppercase tracking-wider text-black/60">{ingredient.name}</span>
            <span className="shrink-0 text-[9px] font-semibold tabular-nums" style={{ color: currentMetricConfig.color }}>
              {ingredient.nutrients[activeMetric]}
            </span>
          </div>
        ))}
      </div>

      {/* Keep selected metric details outside the radial field. */}
      <AnimatePresence>
        {activeNode && (
          <Motion.div
            key={activeNode.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="relative z-20 mx-auto mt-3 w-full max-w-sm rounded-xl border border-black/10 bg-white/95 p-3 shadow-xl backdrop-blur-xl pointer-events-none lg:absolute lg:right-10 lg:top-[54%] lg:mx-0 lg:mt-0 lg:w-44"
          >
            <div className="grid grid-cols-2 gap-2">
              {METRICS.map((metric) => (
                <div key={metric.key} className="flex flex-col">
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-black/50">{metric.label.split(' ')[0]}</span>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-black/5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(activeNode.nutrients[metric.key] / PROTOTYPE_INDEX_RANGES.nutrientMetrics.max) * 100}%`,
                          backgroundColor: metric.color,
                        }}
                      />
                    </div>
                    <span className="text-[9px] font-semibold tabular-nums">{activeNode.nutrients[metric.key]}</span>
                  </div>
                </div>
              ))}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
