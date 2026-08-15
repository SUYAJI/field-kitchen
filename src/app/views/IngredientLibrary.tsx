import { useEffect, useState, useMemo } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { X, Calendar, Flame, Droplets, Beaker, Sprout, Wind, Link2, MapPin, Leaf } from "lucide-react";
import { getIngredientByPairingLabel, INGREDIENTS, Ingredient, MONTH_INITIALS, PrepMethod, Region } from "../data";

const PrepIcon = ({ type, className }: { type: PrepMethod; className?: string }) => {
  switch (type) {
    case 'Roasted': return <Flame className={`w-3.5 h-3.5 ${className}`} />;
    case 'Steamed': return <Droplets className={`w-3.5 h-3.5 ${className}`} />;
    case 'Fermented': return <Beaker className={`w-3.5 h-3.5 ${className}`} />;
    case 'Simmered': return <Droplets className={`w-3.5 h-3.5 ${className}`} />;
    case 'Raw': return <Sprout className={`w-3.5 h-3.5 ${className}`} />;
    case 'Pickled': return <Beaker className={`w-3.5 h-3.5 ${className}`} />;
    case 'Ground': return <Wind className={`w-3.5 h-3.5 ${className}`} />;
    case 'Soaked': return <Droplets className={`w-3.5 h-3.5 ${className}`} />;
    default: return <Sprout className={`w-3.5 h-3.5 ${className}`} />;
  }
};

export function IngredientLibrary({ activeRegion }: { activeRegion: Region | "All" }) {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  const filteredIngredients = useMemo(() => {
    return INGREDIENTS.filter(
      (item) => activeRegion === "All" || item.region.includes(activeRegion as Region)
    );
  }, [activeRegion]);

  useEffect(() => {
    if (selectedIngredient && !filteredIngredients.some((ingredient) => ingredient.id === selectedIngredient.id)) {
      setSelectedIngredient(null);
    }
  }, [filteredIngredients, selectedIngredient]);

  return (
    <div className="w-full h-full flex overflow-hidden relative">
      <div className={`flex-1 transition-all duration-700 ease-[0.16,1,0.3,1] ${selectedIngredient ? 'md:pr-[440px]' : ''} overflow-y-auto p-6 md:p-10`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-20">
          <AnimatePresence>
            {filteredIngredients.map((ingredient, idx) => {
              const pairingStrength = ingredient.pairings.length;
              return (
                <Motion.div
                  key={ingredient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.04, ease: "easeOut" }}
                  whileHover="hover"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedIngredient(ingredient)}
                  className={`group relative h-[340px] bg-white/40 backdrop-blur-md border border-black/5 rounded-2xl flex flex-col justify-between cursor-pointer overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${selectedIngredient?.id === ingredient.id ? 'ring-2 ring-black/20 shadow-2xl' : ''}`}
                >
                  {/* Hover BG */}
                  <div 
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-70"
                    style={{ 
                      backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.15)), url(${ingredient.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />

                  <header className="relative z-10 p-5 flex justify-between items-start">
                    <div className="flex flex-col gap-1.5">
                      {/* Season Tag */}
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-semibold text-black/50 group-hover:text-white/80 transition-colors duration-500 bg-black/[0.03] group-hover:bg-white/10 px-2 py-0.5 rounded-full w-fit">
                        <Leaf className="w-2.5 h-2.5" />
                        {ingredient.seasons.join(' / ')}
                      </span>
                      {/* Region Tag */}
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-semibold text-black/40 group-hover:text-white/70 transition-colors duration-500">
                        <MapPin className="w-2.5 h-2.5" />
                        {ingredient.region[0]}
                      </span>
                    </div>
                    {/* Nutrient Density */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ingredient.color }} />
                        <span className="text-[9px] font-semibold tracking-wider uppercase text-black/40 group-hover:text-white/70 transition-colors">
                          ND {ingredient.nutrientDensity}
                        </span>
                      </div>
                      {/* Pairing Strength */}
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-semibold text-black/30 group-hover:text-white/60 transition-colors">
                        <Link2 className="w-2.5 h-2.5" />
                        {pairingStrength}
                      </span>
                    </div>
                  </header>

                  <div className="relative z-10 p-5 mt-auto">
                    <h2 className="font-['Playfair_Display'] text-4xl font-semibold tracking-tight text-[#1a1a1a] mb-1 group-hover:text-white transition-colors duration-500">
                      {ingredient.name}
                    </h2>
                    <Motion.div 
                      variants={{
                        hover: { opacity: 1, x: 0 },
                        initial: { opacity: 0, x: -8 }
                      }}
                      initial="initial"
                      transition={{ duration: 0.3 }}
                      className="text-[10px] font-['Space_Grotesk'] text-white/80 tracking-widest uppercase"
                    >
                      View Structure →
                    </Motion.div>
                  </div>

                  <footer className="relative z-10 px-5 pb-4 flex justify-between items-center text-black/40 group-hover:text-white/60 transition-colors duration-500 pt-3 border-t border-black/5 group-hover:border-white/10 mx-2">
                    <div className="flex gap-1.5">
                      {ingredient.preparations.slice(0, 4).map((prep) => (
                        <div key={prep} className="p-1 bg-black/[0.03] group-hover:bg-white/10 rounded transition-colors" title={prep}>
                          <PrepIcon type={prep} />
                        </div>
                      ))}
                    </div>
                    <span className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: ingredient.color }}>
                      {ingredient.sourceLayer}
                    </span>
                  </footer>
                </Motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedIngredient && (
          <Motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 right-0 h-full w-full max-w-[440px] bg-[#faf9f6]/90 backdrop-blur-2xl border-l border-black/10 flex flex-col shadow-2xl overflow-y-auto z-50"
          >
            {/* Hero Image */}
            <div className="relative h-48 shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${selectedIngredient.image})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-transparent to-transparent" />
              <button 
                onClick={() => setSelectedIngredient(null)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md hover:bg-white rounded-full transition-colors z-10"
              >
                <X className="w-4 h-4 text-black/60" />
              </button>
            </div>

            <div className="px-8 pb-8 -mt-8 relative z-10 flex flex-col flex-1">
              <h2 className="font-['Playfair_Display'] text-5xl tracking-[-0.02em] font-semibold mb-1 text-[#1a1a1a]">
                {selectedIngredient.name}
              </h2>
              <p className="text-[10px] tracking-widest uppercase text-black/50 font-semibold mb-8">
                {selectedIngredient.originTag} — {selectedIngredient.sourceLayer} — {selectedIngredient.region.join(', ')}
              </p>

              <div className="space-y-8 flex-1">
                {/* Harvest Window */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-black/40 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Harvest Window
                  </span>
                  <div className="flex gap-[2px] h-7 rounded-lg overflow-hidden bg-black/5">
                    {[...Array(12)].map((_, i) => {
                      const [s, e] = selectedIngredient.harvestWindow;
                      const isActive = s <= e ? i >= s && i <= e : i >= s || i <= e;
                      return (
                        <Motion.div 
                          key={i}
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: isActive ? 1 : 0.15, scaleY: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 + i * 0.03 }}
                          className="flex-1 h-full origin-bottom flex items-end justify-center"
                          style={{ backgroundColor: isActive ? selectedIngredient.color : 'transparent' }}
                        >
                          <span className="text-[7px] font-semibold text-black/20 mb-0.5">{MONTH_INITIALS[i]}</span>
                        </Motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Pairing Field Preview */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-black/40 flex items-center gap-2">
                    <Link2 className="w-3 h-3" /> Pairing Network
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedIngredient.pairings.map((p) => {
                      const paired = getIngredientByPairingLabel(p);
                      return (
                        <button
                          key={p}
                          onClick={() => paired && setSelectedIngredient(paired)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white/60 border border-black/5 rounded-full text-xs hover:border-black/20 transition-colors group/pair"
                        >
                          {paired && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: paired.color }} />}
                          <span className="text-black/70 group-hover/pair:text-black">{p}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Nutrient Profile */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-black/40">Nutrient Density Matrix</span>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Protein', val: selectedIngredient.nutrients.protein },
                      { label: 'Mineral', val: selectedIngredient.nutrients.mineral },
                      { label: 'Fiber', val: selectedIngredient.nutrients.fiber },
                      { label: 'Digestibility', val: selectedIngredient.nutrients.digestibility },
                    ].map((nut, i) => (
                      <div key={nut.label} className="bg-white/70 p-3 border border-black/5 rounded-xl">
                        <div className="text-[9px] uppercase tracking-widest text-black/40 mb-2">{nut.label}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-black/5 rounded-full overflow-hidden">
                            <Motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${nut.val}%` }}
                              transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: selectedIngredient.color }}
                            />
                          </div>
                          <span className="font-['Playfair_Display'] text-lg tabular-nums">{nut.val}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Methods */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-black/40">Preparation Techniques</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedIngredient.preparations.map((p) => (
                      <div key={p} className="flex items-center gap-2 px-3 py-1.5 bg-white/60 border border-black/5 rounded-full text-xs text-black/70">
                        <PrepIcon type={p} className="text-black/40" />
                        {p}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regional Context */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-black/40 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Regional Sourcing
                  </span>
                  <div className="bg-white/60 border border-black/5 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-black/50">Origin</span>
                      <span className="text-black/80">{selectedIngredient.originTag}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-black/50">Source Layer</span>
                      <span className="text-black/80">{selectedIngredient.sourceLayer}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-black/50">Regions</span>
                      <span className="text-black/80">{selectedIngredient.region.join(', ')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-black/50">Local Priority</span>
                      <span style={{ color: selectedIngredient.color }}>{selectedIngredient.localPriority}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
