import { useMemo, useState } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { INGREDIENTS, PREPARATION_METHODS, Region, PrepMethod } from "../data";
import { Flame, Droplets, Beaker, Sprout, Wind, Check } from "lucide-react";

const PREP_METHOD_ICONS: Record<PrepMethod, any> = {
  Roasted: Flame,
  Steamed: Droplets,
  Fermented: Beaker,
  Simmered: Droplets,
  Raw: Sprout,
  Pickled: Beaker,
  Ground: Wind,
  Soaked: Droplets,
};

const PREP_METHODS = PREPARATION_METHODS.map((method) => ({
  ...method,
  icon: PREP_METHOD_ICONS[method.id],
}));

type ViewMode = 'cards' | 'matrix';

export function PreparationGuide({ activeRegion }: { activeRegion: Region | "All" }) {
  const [activeMethod, setActiveMethod] = useState<PrepMethod>('Roasted');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const filteredIngredients = useMemo(() => {
    return INGREDIENTS.filter(
      (item) => activeRegion === "All" || item.region.includes(activeRegion as Region)
    );
  }, [activeRegion]);

  const compatibleIngredients = useMemo(() => {
    return filteredIngredients.filter(i => i.preparations.includes(activeMethod));
  }, [filteredIngredients, activeMethod]);

  return (
    <div className="w-full min-h-0 flex flex-col p-5 sm:p-6 lg:p-10 relative overflow-visible lg:h-full lg:overflow-hidden">
      <header className="mb-6 relative z-20 shrink-0 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
        <div>
          <Motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-['Playfair_Display'] text-4xl md:text-6xl font-semibold tracking-[-0.02em] text-[#1a1a1a]"
          >
            Preparation Guide
          </Motion.h2>
          <span className="text-[10px] uppercase font-semibold tracking-widest text-black/40">
            Technique-Ingredient Compatibility
          </span>
        </div>
        <div className="flex gap-2 text-[10px] uppercase tracking-widest font-semibold">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-full border transition-all duration-300 ${viewMode === 'cards' ? 'bg-black text-white border-black' : 'border-black/10 text-black/40'}`}
          >
            Card View
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-4 py-2 rounded-full border transition-all duration-300 ${viewMode === 'matrix' ? 'bg-black text-white border-black' : 'border-black/10 text-black/40'}`}
          >
            Matrix
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {viewMode === 'cards' ? (
          <Motion.main
            key="cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-none flex flex-col lg:flex-row gap-8 mt-2 z-10 relative min-h-0 lg:flex-1"
          >
            {/* Techniques List */}
            <div className="w-full lg:w-1/3 flex flex-col gap-3 lg:border-r border-black/10 lg:pr-6 overflow-visible pb-8 shrink-0 lg:overflow-y-auto">
              <div className="text-[10px] uppercase font-semibold tracking-widest text-black/30 mb-2">Technique Index</div>
              {PREP_METHODS.map((method) => {
                const Icon = method.icon;
                const isActive = activeMethod === method.id;
                const count = filteredIngredients.filter(i => i.preparations.includes(method.id)).length;
                
                return (
                  <button
                    key={method.id}
                    onClick={() => setActiveMethod(method.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 border ${isActive ? 'bg-white/60 border-black/10 shadow-sm translate-x-2' : 'border-transparent hover:bg-white/20 text-black/40 hover:text-black/60'}`}
                  >
                    <div className={`p-2.5 rounded-full ${isActive ? 'bg-black text-white' : 'bg-black/5 text-black/40'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-['Playfair_Display'] text-xl tracking-wide">{method.label}</span>
                      <span className="text-[9px] uppercase tracking-widest text-black/30">{count} ingredients</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Compatible Ingredients */}
            <div className="w-full lg:w-2/3 relative flex flex-col overflow-visible pb-12 lg:overflow-y-auto">
              <div className="text-[10px] uppercase font-semibold tracking-widest text-black/30 mb-6">Compatible Ingredients</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                <AnimatePresence mode="popLayout">
                  {compatibleIngredients.map((ingredient, i) => (
                    <Motion.div
                      key={`${activeMethod}-${ingredient.id}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
                      className="bg-white/40 backdrop-blur-sm border border-black/5 p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden group"
                    >
                      <Motion.div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500"
                        style={{ backgroundColor: ingredient.color }}
                      />
                      
                      <div className="flex justify-between items-start relative z-10">
                        <span className="text-[9px] uppercase font-semibold tracking-widest text-black/40">
                          {ingredient.originTag}
                        </span>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ingredient.color }} />
                      </div>

                      <h3 className="font-['Playfair_Display'] text-2xl font-semibold relative z-10">
                        {ingredient.name}
                      </h3>

                      <div className="flex flex-wrap gap-1.5 relative z-10">
                        {ingredient.preparations.map(p => (
                          <span 
                            key={p} 
                            className={`text-[8px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full border ${p === activeMethod ? 'bg-black text-white border-black' : 'text-black/30 border-black/5'}`}
                          >
                            {p}
                          </span>
                        ))}
                      </div>

                      <div className="text-[9px] uppercase font-semibold tracking-widest text-black/30 border-t border-black/5 pt-3 mt-1 relative z-10">
                        Pairs: {ingredient.pairings.join(', ')}
                      </div>
                    </Motion.div>
                  ))}
                </AnimatePresence>

                {compatibleIngredients.length === 0 && (
                  <Motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-2 flex flex-col items-center justify-center p-12 text-black/30 text-xs tracking-widest uppercase font-semibold"
                  >
                    No compatible ingredients in current region
                  </Motion.div>
                )}
              </div>
            </div>
          </Motion.main>
        ) : (
          <Motion.main
            key="matrix"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-none overflow-x-auto overflow-y-visible z-10 relative pb-12 overscroll-x-contain lg:flex-1 lg:overflow-auto"
          >
            <div className="text-[10px] uppercase font-semibold tracking-widest text-black/30 mb-4">Compatibility Matrix</div>
            <div className="min-w-[700px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-3 text-[10px] uppercase tracking-widest font-semibold text-black/40 border-b border-black/10 sticky left-0 bg-[#faf9f6]/90 backdrop-blur-md z-10">
                      Ingredient
                    </th>
                    {PREP_METHODS.map((m) => {
                      const Icon = m.icon;
                      return (
                        <th 
                          key={m.id} 
                          className={`p-3 text-center border-b transition-colors cursor-pointer ${activeMethod === m.id ? 'border-black/20 bg-black/[0.03]' : 'border-black/10'}`}
                          onClick={() => setActiveMethod(m.id)}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Icon className="w-3.5 h-3.5 text-black/40" />
                            <span className="text-[9px] uppercase tracking-widest font-semibold text-black/40">{m.label}</span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredIngredients.map((ingredient, idx) => (
                    <Motion.tr
                      key={ingredient.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group hover:bg-white/40 transition-colors"
                    >
                      <td className="p-3 border-b border-black/5 sticky left-0 bg-[#faf9f6]/90 backdrop-blur-md z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ingredient.color }} />
                          <span className="font-['Playfair_Display'] text-lg">{ingredient.name}</span>
                        </div>
                      </td>
                      {PREP_METHODS.map((m) => {
                        const isCompatible = ingredient.preparations.includes(m.id);
                        const isHighlighted = m.id === activeMethod;
                        return (
                          <td 
                            key={m.id} 
                            className={`p-3 text-center border-b border-black/5 transition-colors ${isHighlighted ? 'bg-black/[0.02]' : ''}`}
                          >
                            {isCompatible ? (
                              <Motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: idx * 0.02 + 0.1 }}
                                className="flex items-center justify-center"
                              >
                                <div 
                                  className="w-6 h-6 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: ingredient.color + '20' }}
                                >
                                  <Check className="w-3 h-3" style={{ color: ingredient.color }} />
                                </div>
                              </Motion.div>
                            ) : (
                              <span className="text-black/10">—</span>
                            )}
                          </td>
                        );
                      })}
                    </Motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
