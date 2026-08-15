import { useState, useMemo } from "react";
import { motion as Motion, AnimatePresence, useReducedMotion } from "motion/react";
import { REGIONS, Region } from "./data";
import { IngredientLibrary } from "./views/IngredientLibrary";
import { SeasonalMap } from "./views/SeasonalMap";
import { SourceMap } from "./views/SourceMap";
import { NutrientView } from "./views/NutrientView";
import { PreparationGuide } from "./views/PreparationGuide";
import { PairingField } from "./views/PairingField";
import { LandingPage } from "./views/LandingPage";

type ViewMode = "LANDING" | "LIBRARY" | "SEASONAL" | "SOURCE" | "NUTRIENT" | "PREPARATION" | "PAIRING";

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const [activeView, setActiveView] = useState<ViewMode>("LANDING");
  const [activeRegion, setActiveRegion] = useState<Region | "All">("All");

  const regions: (Region | "All")[] = ["All", ...REGIONS];
  const views: { id: ViewMode; label: string }[] = [
    { id: "LIBRARY", label: "Ingredient Library" },
    { id: "PAIRING", label: "Pairing Field" },
    { id: "SEASONAL", label: "Seasonal Map" },
    { id: "SOURCE", label: "Source Map" },
    { id: "NUTRIENT", label: "Nutrient View" },
    { id: "PREPARATION", label: "Preparation Guide" },
  ];

  const activeViewLabel = useMemo(() => {
    return views.find(v => v.id === activeView)?.label ?? '';
  }, [activeView]);

  const breadcrumbParts = useMemo(() => {
    const parts: string[] = [];
    if (activeViewLabel) parts.push(activeViewLabel);
    if (activeRegion !== "All") parts.push(activeRegion);
    return parts;
  }, [activeViewLabel, activeRegion]);

  return (
    <div className="w-full min-h-dvh overflow-x-hidden bg-[#faf9f6] flex flex-col text-[#1a1a1a] font-['Space_Grotesk'] selection:bg-[#e76f51]/30 lg:h-dvh lg:overflow-hidden">
      <AnimatePresence mode="wait">
        {activeView === "LANDING" ? (
          <Motion.div 
            key="LANDING"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-dvh relative z-[100] lg:h-full lg:absolute lg:inset-0"
          >
            <LandingPage onEnter={() => setActiveView("LIBRARY")} />
          </Motion.div>
        ) : (
          <Motion.div 
            key="APP_SHELL"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-dvh flex flex-col relative z-0 lg:h-full"
          >
            {/* Background Texture & Gradients */}
            <div className="absolute inset-0 pointer-events-none opacity-80 mix-blend-multiply overflow-hidden">
              <div 
                className="absolute inset-0 opacity-[0.04]" 
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
              />
              
              {/* Soft Organic Gradients with slow drifting */}
              <Motion.div 
                animate={shouldReduceMotion ? undefined : { x: [0, 40, -20, 0], y: [0, -40, 20, 0] }}
                transition={shouldReduceMotion ? undefined : { duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-[#f4a261] blur-[120px] mix-blend-multiply opacity-50" 
              />
              <Motion.div 
                animate={shouldReduceMotion ? undefined : { x: [0, -30, 30, 0], y: [0, 50, -30, 0] }}
                transition={shouldReduceMotion ? undefined : { duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-[#e76f51] blur-[140px] mix-blend-multiply opacity-40" 
              />
              <Motion.div 
                animate={shouldReduceMotion ? undefined : { x: [0, 50, -50, 0], y: [0, 20, -50, 0] }}
                transition={shouldReduceMotion ? undefined : { duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[#2a9d8f] blur-[100px] mix-blend-multiply opacity-30" 
              />
            </div>

            {/* Top Navigation Bar */}
            <header className="relative z-50 flex flex-col xl:flex-row items-start xl:items-center justify-between p-5 md:p-6 xl:p-10 gap-4 xl:gap-6 border-b border-black/5 backdrop-blur-sm">
              <button 
                type="button"
                onClick={() => setActiveView("LANDING")}
                aria-label="Return to Field Kitchen landing"
                className="font-['Playfair_Display'] text-3xl min-[1360px]:text-5xl tracking-[-0.04em] uppercase font-semibold text-[#0d2110] hover:opacity-70 transition-opacity shrink-0 min-h-11"
              >
                Field Kitchen
              </button>
              
              <nav aria-label="Primary views" className="w-full xl:w-auto flex flex-nowrap gap-5 xl:gap-4 min-[1360px]:gap-6 overflow-x-auto whitespace-nowrap pb-2 xl:pb-1 text-xs xl:text-[11px] min-[1360px]:text-xs font-semibold tracking-[0.15em] xl:tracking-[0.12em] min-[1360px]:tracking-[0.15em] uppercase text-black/50 overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {views.map((v) => (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => setActiveView(v.id)}
                    aria-current={activeView === v.id ? 'page' : undefined}
                    className={`hover:text-black/80 transition-colors duration-500 pb-1 border-b min-h-11 ${activeView === v.id ? 'text-black/90 border-black/30' : 'border-transparent'}`}
                  >
                    {v.label}
                  </button>
                ))}
              </nav>
            </header>

            {/* Mode Indicator Breadcrumb */}
            <div aria-label="Current location" className="relative z-40 px-5 md:px-6 xl:px-10 py-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-[10px] uppercase tracking-[0.2em] font-semibold text-black/40 backdrop-blur-md bg-[#faf9f6]/30 border-b border-black/[0.03] overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="text-black/40">Field Kitchen</span>
              <span className="text-black/25">/</span>
              <span className="text-black/40">Pacific Northwest</span>
              {breadcrumbParts.map((part, i) => (
                <span key={part} className="flex items-center gap-2">
                  <span className="text-black/25">/</span>
                  <span className={i === 0 ? 'text-black/50' : 'text-[#d84b2a]/60'}>{part}</span>
                </span>
              ))}
            </div>

            {/* Persistent Region Filter */}
            <div role="group" aria-label="Filter by region" className="relative z-40 px-5 md:px-6 xl:px-10 py-3 flex flex-nowrap gap-3 items-center overflow-x-auto whitespace-nowrap text-[10px] uppercase tracking-widest font-semibold border-b border-black/5 backdrop-blur-md overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="text-black/45 mr-2 shrink-0">Region:</span>
              {regions.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setActiveRegion(r)}
                  aria-pressed={activeRegion === r}
                  className={`px-3 py-1.5 rounded-full border transition-all duration-300 shrink-0 min-h-11 ${activeRegion === r ? 'border-[#d84b2a]/50 bg-[#d84b2a]/10 text-[#d84b2a]' : 'border-black/10 text-black/50 hover:border-black/30 hover:text-black/70'}`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Main Content Area with View Transitions */}
            <main aria-label={activeViewLabel} className="relative z-[60] flex-none overflow-visible lg:z-10 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
              <AnimatePresence mode="wait">
                {activeView === "LIBRARY" && (
                  <Motion.div key="LIBRARY" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration: 0.8, ease: "easeOut"}} className="w-full min-h-0 lg:h-full">
                    <IngredientLibrary activeRegion={activeRegion} />
                  </Motion.div>
                )}
                {activeView === "SEASONAL" && (
                  <Motion.div key="SEASONAL" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration: 0.8, ease: "easeOut"}} className="w-full min-h-0 lg:h-full">
                    <SeasonalMap activeRegion={activeRegion} />
                  </Motion.div>
                )}
                {activeView === "SOURCE" && (
                  <Motion.div key="SOURCE" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration: 0.8, ease: "easeOut"}} className="w-full min-h-0 lg:h-full">
                    <SourceMap activeRegion={activeRegion} />
                  </Motion.div>
                )}
                {activeView === "NUTRIENT" && (
                  <Motion.div key="NUTRIENT" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration: 0.8, ease: "easeOut"}} className="w-full min-h-0 lg:h-full">
                    <NutrientView activeRegion={activeRegion} />
                  </Motion.div>
                )}
                {activeView === "PREPARATION" && (
                  <Motion.div key="PREPARATION" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration: 0.8, ease: "easeOut"}} className="w-full min-h-0 lg:h-full">
                    <PreparationGuide activeRegion={activeRegion} />
                  </Motion.div>
                )}
                {activeView === "PAIRING" && (
                  <Motion.div key="PAIRING" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration: 0.8, ease: "easeOut"}} className="w-full min-h-0 lg:h-full">
                    <PairingField activeRegion={activeRegion} />
                  </Motion.div>
                )}
              </AnimatePresence>
            </main>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
