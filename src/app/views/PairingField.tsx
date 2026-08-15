import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion as Motion, AnimatePresence, useReducedMotion } from "motion/react";
import { getPairingStrength, INGREDIENTS, Ingredient, PairingStrength, PREPARATION_METHODS, Region, PrepMethod } from "../data";
import { Flame, Droplets, Beaker, Sprout, Wind } from "lucide-react";

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

const STRENGTH_CONFIG: Record<Exclude<PairingStrength, null>, { label: string; opacity: number; glow: number; lineWidth: number; color: string }> = {
  strong:       { label: 'Strong Pairing',  opacity: 1,    glow: 12, lineWidth: 2.5, color: 'rgba(255,255,255,0.9)' },
  medium:       { label: 'Medium Pairing',  opacity: 0.85, glow: 6,  lineWidth: 1.5, color: 'rgba(255,255,255,0.6)' },
  experimental: { label: 'Experimental',    opacity: 0.6,  glow: 0,  lineWidth: 0.8, color: 'rgba(255,255,255,0.35)' },
};

export function PairingField({ activeRegion }: { activeRegion: Region | "All" }) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [activeFilters, setActiveFilters] = useState<PrepMethod[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cardPositions, setCardPositions] = useState<Map<string, { x: number; y: number }>>(new Map());

  const filteredIngredients = useMemo(() => {
    return INGREDIENTS.filter(
      (item) => activeRegion === "All" || item.region.includes(activeRegion as Region)
    );
  }, [activeRegion]);

  useEffect(() => {
    setSelectedIngredient((current) =>
      current && activeRegion !== "All" && !current.region.includes(activeRegion) ? null : current
    );
  }, [activeRegion]);

  const toggleFilter = (method: PrepMethod) => {
    setActiveFilters(prev => 
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  
  const updatePositions = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const scrollTop = scrollRef.current?.scrollTop || 0;
    const newPositions = new Map<string, { x: number; y: number }>();
    
    cardRefs.current.forEach((el, id) => {
      const rect = el.getBoundingClientRect();
      newPositions.set(id, {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + scrollTop + rect.height / 2,
      });
    });
    setCardPositions(newPositions);
  }, []);

  useEffect(() => {
    const timer = setTimeout(updatePositions, 300);
    window.addEventListener('resize', updatePositions);
    const scrollEl = scrollRef.current;
    if (scrollEl) scrollEl.addEventListener('scroll', updatePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePositions);
      if (scrollEl) scrollEl.removeEventListener('scroll', updatePositions);
    };
  }, [selectedIngredient, activeFilters, filteredIngredients, updatePositions]);

  // Connection lines with strength
  const connections = useMemo(() => {
    if (!selectedIngredient || cardPositions.size === 0) return [];
    const selectedPos = cardPositions.get(selectedIngredient.id);
    if (!selectedPos) return [];

    return filteredIngredients
      .map(ing => {
        const strength = getPairingStrength(selectedIngredient, ing);
        if (!strength) return null;
        const passesFilters = activeFilters.length === 0 || activeFilters.some(f => ing.preparations.includes(f));
        if (!passesFilters) return null;
        const pos = cardPositions.get(ing.id);
        if (!pos) return null;
        return { from: selectedPos, to: pos, color: ing.color, id: ing.id, strength };
      })
      .filter(Boolean) as { from: { x: number; y: number }; to: { x: number; y: number }; color: string; id: string; strength: Exclude<PairingStrength, null> }[];
  }, [selectedIngredient, cardPositions, filteredIngredients, activeFilters]);

  const scrollTop = scrollRef.current?.scrollTop || 0;

  return (
    <section aria-labelledby="pairing-field-heading" className="w-full min-h-0 flex flex-col p-5 sm:p-6 lg:p-10 relative overflow-visible lg:h-full lg:overflow-hidden">
      <header className="mb-5 lg:mb-6 relative z-20 pointer-events-none shrink-0">
        <Motion.h2 
          id="pairing-field-heading"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-['Playfair_Display'] text-4xl md:text-6xl font-semibold tracking-[-0.02em] text-[#1a1a1a]"
        >
          Pairing Field
        </Motion.h2>
        <span className="text-[10px] uppercase font-semibold tracking-widest text-black/40">
          Progressive Compatibility & Technique Synthesis
        </span>
      </header>

      {/* Technique Filters */}
      <div role="group" aria-label="Filter pairings by preparation technique" className="relative z-20 flex flex-wrap gap-2 mb-5 lg:mb-6 border-b border-black/10 pb-4 lg:pb-5 shrink-0">
        <span className="text-[10px] uppercase font-semibold tracking-widest text-black/45 w-full mb-2">Technique Reshaping Filters</span>
        {PREP_METHODS.map((method) => {
          const isActive = activeFilters.includes(method.id);
          const Icon = method.icon;
          return (
            <button
              type="button"
              key={method.id}
              onClick={() => toggleFilter(method.id)}
              aria-pressed={isActive}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] uppercase tracking-widest font-semibold transition-all duration-300 min-h-11 ${
                isActive 
                  ? 'bg-black text-white border-black shadow-lg' 
                  : 'bg-white/40 text-black/50 border-black/10 hover:border-black/30 backdrop-blur-sm'
              }`}
            >
              <Icon className="w-3 h-3" />
              {method.label}
            </button>
          );
        })}
      </div>

      {/* Strength Legend — visible when ingredient is selected */}
      <AnimatePresence>
        {selectedIngredient && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-20 flex flex-wrap gap-4 mb-4 shrink-0 overflow-hidden"
          >
            {(['strong', 'medium', 'experimental'] as const).map(s => {
              const cfg = STRENGTH_CONFIG[s];
              return (
                <div key={s} className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-semibold text-black/40">
                  <div 
                    className="w-5 h-[2px] rounded-full"
                    style={{ 
                      backgroundColor: s === 'strong' ? '#1a1a1a' : s === 'medium' ? 'rgba(26,26,26,0.5)' : 'rgba(26,26,26,0.2)',
                      height: cfg.lineWidth,
                    }}
                  />
                  {cfg.label}
                </div>
              );
            })}
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Field Visualization */}
      <div ref={containerRef} className="relative z-10 w-full overflow-visible lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        {/* Background glow */}
        <AnimatePresence>
          {selectedIngredient && (
            <Motion.div
              key={`bg-${selectedIngredient.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.12, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full blur-[100px] pointer-events-none"
              style={{ backgroundColor: selectedIngredient.color }}
            />
          )}
        </AnimatePresence>

        {/* Connection Lines SVG */}
        {connections.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ overflow: 'visible' }}>
            <defs>
              {connections.map(conn => (
                <linearGradient key={`grad-${conn.id}`} id={`grad-${conn.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={selectedIngredient?.color || '#000'} stopOpacity={conn.strength === 'strong' ? 0.5 : conn.strength === 'medium' ? 0.3 : 0.15} />
                  <stop offset="100%" stopColor={conn.color} stopOpacity={conn.strength === 'strong' ? 0.5 : conn.strength === 'medium' ? 0.3 : 0.15} />
                </linearGradient>
              ))}
            </defs>
            {connections.map(conn => {
              const cfg = STRENGTH_CONFIG[conn.strength];
              return (
                <Motion.line
                  key={`line-${conn.id}`}
                  x1={conn.from.x}
                  y1={conn.from.y - scrollTop}
                  x2={conn.to.x}
                  y2={conn.to.y - scrollTop}
                  stroke={`url(#grad-${conn.id})`}
                  strokeWidth={cfg.lineWidth}
                  strokeDasharray={conn.strength === 'experimental' ? '4 4' : undefined}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              );
            })}
          </svg>
        )}

        <div
          ref={scrollRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full h-auto overflow-visible pb-12 lg:h-full lg:max-h-full lg:overflow-y-auto lg:pb-20 content-start relative z-10"
        >
          {filteredIngredients.map((ingredient, i) => {
            const isSelected = selectedIngredient?.id === ingredient.id;
            
            // Progressive strength instead of binary
            const strength = selectedIngredient ? getPairingStrength(selectedIngredient, ingredient) : null;
            const passesFilters = activeFilters.length === 0 || activeFilters.some(f => ingredient.preparations.includes(f));
            
            // Visual states
            const isHighlighted = isSelected || (strength !== null && passesFilters);
            const strengthConfig = strength ? STRENGTH_CONFIG[strength] : null;
            const isFaded = (selectedIngredient && !isHighlighted) || (!selectedIngredient && activeFilters.length > 0 && !passesFilters);

            // Compute opacity based on strength
            let cardOpacity = 1;
            if (isFaded) cardOpacity = 0.12;
            else if (selectedIngredient && !isSelected && strengthConfig) cardOpacity = strengthConfig.opacity;

            const strengthLabel = isSelected 
              ? 'Central Node' 
              : (strengthConfig && selectedIngredient) 
                ? strengthConfig.label 
                : '';

            return (
              <Motion.button
                type="button"
                key={ingredient.id}
                ref={(el: HTMLButtonElement | null) => {
                  if (el) cardRefs.current.set(ingredient.id, el);
                  else cardRefs.current.delete(ingredient.id);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: cardOpacity,
                  filter: isFaded ? 'blur(3px) grayscale(40%)' : 'blur(0px) grayscale(0%)',
                }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
                onClick={() => {
                  setSelectedIngredient(isSelected ? null : ingredient);
                  setTimeout(updatePositions, 150);
                }}
                aria-pressed={isSelected}
                aria-label={`${ingredient.name}. ${strengthLabel || 'No active pairing relationship'}${passesFilters || isSelected ? '' : '. Hidden by the active technique filter'}.`}
                className={`relative aspect-square w-full text-left cursor-pointer group rounded-2xl overflow-hidden border transition-all duration-300 origin-center ${
                  isSelected
                    ? 'border-black/40 shadow-2xl z-20 ring-2 ring-white/50 scale-[1.03]'
                    : strength === 'strong' && passesFilters
                    ? 'border-white/50 shadow-xl z-10 hover:scale-[1.02]'
                    : strength === 'medium' && passesFilters
                    ? 'border-white/30 shadow-lg z-10 hover:scale-[1.02]'
                    : strength === 'experimental' && passesFilters
                    ? 'border-white/15 shadow-md z-10 hover:scale-[1.02]'
                    : 'border-black/5 shadow-sm hover:shadow-md hover:scale-[1.02]'
                }`}
              >
                {/* Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${ingredient.image})` }}
                />
                
                {/* Overlay — strength-aware */}
                <div 
                  className={`absolute inset-0 transition-all duration-500 ${isHighlighted ? '' : 'opacity-50 bg-black/40 group-hover:bg-black/20'}`}
                  style={isHighlighted ? { 
                    background: `linear-gradient(to top, rgba(0,0,0,${isSelected ? 0.9 : strength === 'strong' ? 0.85 : strength === 'medium' ? 0.7 : 0.5}), transparent), radial-gradient(circle at center, ${ingredient.color}${strength === 'strong' ? '50' : strength === 'medium' ? '30' : '15'}, transparent)`,
                    opacity: strengthConfig?.opacity ?? 1,
                  } : undefined} 
                />

                {/* Glow ring for strong pairings */}
                {strength === 'strong' && passesFilters && selectedIngredient && (
                  <Motion.div
                    initial={{ opacity: 0 }}
                    animate={shouldReduceMotion ? { opacity: 0.55 } : { opacity: [0.4, 0.7, 0.4] }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: `inset 0 0 20px ${ingredient.color}40, 0 0 15px ${ingredient.color}25` }}
                  />
                )}

                {/* Content */}
                <div className="absolute inset-0 p-2.5 sm:p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-semibold text-white/90 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-md">
                      {ingredient.seasons[0]}
                    </span>
                    {isHighlighted && !isSelected && strengthConfig && (
                      <Motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-full border border-white/50"
                        style={{ 
                          backgroundColor: ingredient.color,
                          width: strength === 'strong' ? 12 : strength === 'medium' ? 10 : 8,
                          height: strength === 'strong' ? 12 : strength === 'medium' ? 10 : 8,
                          boxShadow: strengthConfig.glow > 0 ? `0 0 ${strengthConfig.glow}px rgba(255,255,255,0.8)` : 'none',
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <span className="block font-['Playfair_Display'] text-base sm:text-xl md:text-2xl font-semibold text-white drop-shadow-lg leading-tight">
                      {ingredient.name}
                    </span>
                    <div className="text-[8px] sm:text-[9px] font-semibold tracking-widest uppercase mt-0.5 h-3.5 drop-shadow-md"
                      style={{ 
                        color: strengthLabel 
                          ? (strength === 'strong' ? 'rgba(255,255,255,0.95)' 
                            : strength === 'medium' ? 'rgba(255,255,255,0.7)' 
                            : strength === 'experimental' ? 'rgba(255,255,255,0.45)' 
                            : 'rgba(255,255,255,0.9)')
                          : 'transparent'
                      }}
                    >
                      {strengthLabel}
                    </div>
                  </div>
                </div>

                {/* Filter indicator */}
                {passesFilters && activeFilters.length > 0 && (
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex flex-col gap-0.5">
                    {activeFilters.filter(f => ingredient.preparations.includes(f)).map(f => {
                      const method = PREP_METHODS.find(m => m.id === f);
                      if (!method) return null;
                      const MIcon = method.icon;
                      return (
                        <div key={f} className="p-1 bg-white/20 backdrop-blur-md rounded-full text-white">
                          <MIcon className="w-2.5 h-2.5" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </Motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
