import { useState } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { ArrowRight, X, Database } from "lucide-react";
import {
  ACTIVE_SOURCE_LAYERS,
  DATASET_SUMMARY,
  INGREDIENTS,
  MONTHS,
  NUTRIENT_METRICS,
  PREPARATION_METHODS,
  REGIONS,
  SEASON_MONTHS,
  SEASONS,
  SUPPORTED_SOURCE_LAYERS,
} from "../data";

const DATASET_DETAILS = [
  { label: "Primary Ingredients", value: INGREDIENTS.map((ingredient) => ingredient.name).join(', ') },
  { label: "Ecological Regions", value: REGIONS.join(', ') },
  { label: "Preparation Techniques", value: PREPARATION_METHODS.map((method) => method.label).join(', ') },
  { label: "Nutrient Axes", value: NUTRIENT_METRICS.map((metric) => metric.label).join(', ') },
  { label: "Supported Source Layers", value: SUPPORTED_SOURCE_LAYERS.join(', ') },
  { label: "Active Source Layers", value: ACTIVE_SOURCE_LAYERS.join(', ') },
  {
    label: "Seasonal Windows",
    value: SEASONS.map((season) => {
      const months = SEASON_MONTHS[season];
      return `${season} (${MONTHS[months[0]]}–${MONTHS[months[months.length - 1]]})`;
    }).join(', '),
  },
  { label: "Habitat Contexts", value: [...new Set(INGREDIENTS.map((ingredient) => ingredient.originTag))].join(', ') },
];

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [datasetOpen, setDatasetOpen] = useState(false);

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center overflow-hidden p-6 md:p-12 text-[#0d2110] selection:bg-[#e76f51]/30">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-80 mix-blend-multiply overflow-hidden z-0">
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
        <Motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] rounded-full bg-[#bc6c25] blur-[140px] mix-blend-multiply opacity-20" 
        />
        <Motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute -bottom-[20%] -left-[10%] w-[90vw] h-[90vw] max-w-[1400px] max-h-[1400px] rounded-full bg-[#2a9d8f] blur-[160px] mix-blend-multiply opacity-15" 
        />
        <Motion.div 
          animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] left-[30%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-[#e76f51] blur-[120px] mix-blend-multiply opacity-10" 
        />
      </div>

      <main className="relative z-10 w-full max-w-[1400px] flex flex-col md:flex-row justify-between items-start md:items-end gap-16 md:gap-8 h-full py-12 md:py-24">
        
        {/* Left Column */}
        <div className="flex flex-col h-full justify-between max-w-2xl w-full">
          <header>
            <Motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-black/50 mb-8"
            >
              Pacific Northwest Edition
            </Motion.div>
            <Motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-['Playfair_Display'] text-[12vw] leading-[0.85] tracking-[-0.04em] md:text-[8vw] lg:text-[10rem] font-semibold uppercase text-[#0d2110]"
            >
              Field <br/>
              <span className="italic text-black/80">Kitchen</span>
            </Motion.h1>
          </header>

          <Motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 md:mt-24 max-w-md"
          >
            <p className="font-['Space_Grotesk'] text-sm md:text-base leading-relaxed text-black/60 mb-4">
              FIELD KITCHEN is a spatial ingredient intelligence interface designed to help cooks and researchers explore seasonal availability, regional sourcing relationships, and preparation compatibility across Pacific Northwest food systems.
            </p>
            <p className="font-['Space_Grotesk'] text-sm md:text-base leading-relaxed text-black/40 mb-8">
              Navigate harvest windows, nutrient topographies, and technique-driven compatibility networks across {DATASET_SUMMARY.regionCount} bioregions and {DATASET_SUMMARY.ingredientCount} primary ingredients.
            </p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={onEnter}
                className="group flex items-center gap-4 text-xs font-semibold tracking-[0.2em] uppercase text-black pb-2 border-b border-black/20 hover:border-black transition-colors duration-500 w-fit"
              >
                Enter System
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
              </button>

              <button
                onClick={() => setDatasetOpen(true)}
                className="group flex items-center gap-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-black/40 hover:text-black/70 transition-colors duration-500 w-fit mt-4"
              >
                <Database className="w-3 h-3" />
                Dataset: Pacific Northwest Field Index
              </button>
            </div>
          </Motion.div>
        </div>

        {/* Right Column */}
        <Motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-12 md:pb-12 text-right md:text-left self-end md:self-stretch justify-end"
        >
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-black/40">Region Index</div>
            {REGIONS.map((r, i) => (
              <Motion.div 
                key={r}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                className="font-['Playfair_Display'] text-xl italic text-black/80"
              >
                {r}
              </Motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-black/40">System Metadata</div>
            <div className="flex flex-col gap-1.5">
              {[
                { label: "Active Nodes", value: DATASET_SUMMARY.ingredientCount },
                { label: "Technique Assignments", value: DATASET_SUMMARY.preparationAssignmentCount },
                { label: "Pairing Connections", value: DATASET_SUMMARY.uniqueUndirectedPairingCount },
                { label: "Nutrient Axes", value: DATASET_SUMMARY.nutrientAxisCount },
              ].map((item, i) => (
                <Motion.div
                  key={item.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.08 }}
                  className="flex items-center gap-3 text-xs"
                >
                  <span className="text-black/30 font-semibold tracking-widest uppercase text-[10px]">{item.label}</span>
                  <span className="h-px flex-1 bg-black/10" />
                  <span className="font-['Space_Grotesk'] text-black/70 tabular-nums">{item.value}</span>
                </Motion.div>
              ))}
            </div>
          </div>
        </Motion.div>
      </main>

      {/* Dataset Transparency Panel */}
      <AnimatePresence>
        {datasetOpen && (
          <>
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200]"
              onClick={() => setDatasetOpen(false)}
            />
            <Motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 h-full w-full max-w-[520px] bg-[#faf9f6]/95 backdrop-blur-2xl border-l border-black/10 z-[201] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-8 border-b border-black/10">
                <div>
                  <h3 className="font-['Playfair_Display'] text-2xl font-semibold tracking-tight">Dataset Index</h3>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-black/40">Pacific Northwest Field Index</span>
                </div>
                <button onClick={() => setDatasetOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X className="w-5 h-5 text-black/50" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                  {[
                    { n: DATASET_SUMMARY.ingredientCount, l: "Ingredients" },
                    { n: DATASET_SUMMARY.regionCount, l: "Regions" },
                    { n: DATASET_SUMMARY.preparationMethodCount, l: "Techniques" },
                    { n: DATASET_SUMMARY.nutrientAxisCount, l: "Nutrient Axes" },
                    { n: DATASET_SUMMARY.uniqueUndirectedPairingCount, l: "Pairings" },
                    { n: DATASET_SUMMARY.seasonalWindowCount, l: "Seasonal Windows" },
                  ].map((s, i) => (
                    <Motion.div
                      key={s.l}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="bg-white/60 border border-black/5 rounded-xl p-4 flex flex-col items-center"
                    >
                      <span className="font-['Playfair_Display'] text-3xl font-semibold text-[#0d2110]">{s.n}</span>
                      <span className="text-[9px] uppercase tracking-widest font-semibold text-black/40 mt-1 text-center">{s.l}</span>
                    </Motion.div>
                  ))}
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-6">
                  {DATASET_DETAILS.map((d, i) => (
                    <Motion.div
                      key={d.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className="border-b border-black/5 pb-4"
                    >
                      <div className="text-[10px] uppercase tracking-widest font-semibold text-black/40 mb-2">{d.label}</div>
                      <p className="text-sm text-black/70 leading-relaxed">{d.value}</p>
                    </Motion.div>
                  ))}
                </div>

                <div className="mt-10 p-5 bg-[#2a9d8f]/5 border border-[#2a9d8f]/10 rounded-xl">
                  <div className="text-[10px] uppercase tracking-widest font-semibold text-[#2a9d8f]/60 mb-2">Data Provenance</div>
                  <p className="text-xs text-black/50 leading-relaxed">
                    This prototype dataset uses modeled, illustrative values for harvest windows, nutrient profiles, sourcing, and pairing relationships. It demonstrates the interface and does not yet include field-level provenance or citations.
                  </p>
                </div>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
