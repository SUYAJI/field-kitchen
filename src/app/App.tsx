import { useCallback, useState } from "react";
import { motion as Motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { IngredientId } from "./data";
import { KitchenPlanner } from "./views/KitchenPlanner";
import { IngredientLibrary } from "./views/IngredientLibrary";
import { SeasonalMap } from "./views/SeasonalMap";
import { SourcesView } from "./views/SourcesView";
import { LandingPage } from "./views/LandingPage";

type ViewMode = "LANDING" | "KITCHEN" | "INGREDIENTS" | "SEASONS" | "SOURCES";

const VIEWS: { id: Exclude<ViewMode, "LANDING">; label: string }[] = [
  { id: "KITCHEN", label: "Kitchen" },
  { id: "INGREDIENTS", label: "Ingredients" },
  { id: "SEASONS", label: "Seasons" },
  { id: "SOURCES", label: "Sources" },
];

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  const [activeView, setActiveView] = useState<ViewMode>("LANDING");
  const [selectedIds, setSelectedIds] = useState<IngredientId[]>([]);

  const toggleIngredient = useCallback((id: IngredientId) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }, []);

  const activeLabel = VIEWS.find((view) => view.id === activeView)?.label ?? "";

  return (
    <div className="w-full min-h-dvh overflow-x-hidden bg-[#faf9f6] flex flex-col text-[#1a1a1a] font-['Space_Grotesk'] selection:bg-[#e76f51]/30 lg:h-dvh lg:overflow-hidden">
      <AnimatePresence mode="wait">
        {activeView === "LANDING" ? (
          <Motion.div
            key="LANDING"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-dvh relative z-[100] lg:h-full lg:absolute lg:inset-0"
          >
            <LandingPage onStart={() => setActiveView("KITCHEN")} onOpenSources={() => setActiveView("SOURCES")} />
          </Motion.div>
        ) : (
          <Motion.div
            key="APP_SHELL"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-dvh flex flex-col relative z-0 lg:h-full"
          >
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-70 mix-blend-multiply overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
              />
              <Motion.div
                animate={shouldReduceMotion ? undefined : { x: [0, 40, -20, 0], y: [0, -40, 20, 0] }}
                transition={shouldReduceMotion ? undefined : { duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-15%] right-[-10%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] rounded-full bg-[#f4a261] blur-[120px] opacity-40"
              />
              <Motion.div
                animate={shouldReduceMotion ? undefined : { x: [0, -30, 30, 0], y: [0, 50, -30, 0] }}
                transition={shouldReduceMotion ? undefined : { duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-15%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-[#2a9d8f] blur-[140px] opacity-20"
              />
            </div>

            <header className="relative z-50 flex flex-col gap-2 border-b border-black/10 px-5 pt-4 pb-1 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-3 md:px-6 lg:px-10">
              <button
                type="button"
                onClick={() => setActiveView("LANDING")}
                aria-label="Return to Field Kitchen introduction"
                className="self-start font-['Playfair_Display'] text-2xl font-semibold uppercase tracking-[-0.03em] text-[#0d2110] transition-opacity hover:opacity-70 sm:self-auto lg:text-3xl min-h-11"
              >
                Field Kitchen
              </button>
              <nav aria-label="Primary" className="-mx-5 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
                {VIEWS.map((view) => {
                  const isActive = activeView === view.id;
                  return (
                    <button
                      type="button"
                      key={view.id}
                      onClick={() => setActiveView(view.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative min-h-11 shrink-0 px-3 text-sm font-semibold tracking-wide transition-colors duration-300 ${isActive ? "text-[#1a1a1a]" : "text-black/60 hover:text-black/85"}`}
                    >
                      {view.label}
                      {view.id === "KITCHEN" && selectedIds.length > 0 && (
                        <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b5401f] px-1.5 text-[10px] text-white">
                          {selectedIds.length}
                          <span className="sr-only"> ingredients selected</span>
                        </span>
                      )}
                      {isActive && <span aria-hidden="true" className="absolute inset-x-3 bottom-1 h-[2px] rounded-full bg-[#1a1a1a]" />}
                    </button>
                  );
                })}
              </nav>
            </header>

            <main aria-label={activeLabel} className="relative z-10 flex-none lg:flex-1 lg:min-h-0 lg:overflow-hidden">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full min-h-0 lg:h-full"
                >
                  {activeView === "KITCHEN" && (
                    <KitchenPlanner
                      selectedIds={selectedIds}
                      onToggle={toggleIngredient}
                      onSetSelection={setSelectedIds}
                      onOpenSources={() => setActiveView("SOURCES")}
                    />
                  )}
                  {activeView === "INGREDIENTS" && (
                    <IngredientLibrary selectedIds={selectedIds} onToggle={toggleIngredient} onOpenKitchen={() => setActiveView("KITCHEN")} />
                  )}
                  {activeView === "SEASONS" && <SeasonalMap selectedIds={selectedIds} onToggle={toggleIngredient} />}
                  {activeView === "SOURCES" && <SourcesView />}
                </Motion.div>
              </AnimatePresence>
            </main>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
