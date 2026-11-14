import { motion as Motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { INGREDIENTS } from "../data";
import { PREPARATIONS } from "../preparations";
import { IngredientThumb } from "../components";

const STEPS = [
  { title: "Choose", text: "Select the ingredients you have." },
  { title: "Compare", text: "See what you could make, and what else each idea needs." },
  { title: "Take away", text: "Open a method and copy it to your prep list." },
];

const PREVIEW_IDS = ["potato", "mushroom", "apple", "carrot", "hazelnut", "kale"];

export function LandingPage({ onStart, onOpenSources }: { onStart: () => void; onOpenSources: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const everydayCount = INGREDIENTS.filter((item) => item.category !== "Specialty & botanicals").length;
  const specialtyCount = INGREDIENTS.length - everydayCount;

  return (
    <div className="relative w-full min-h-dvh flex flex-col justify-start lg:justify-center items-center overflow-x-hidden p-6 md:p-12 text-[#0d2110] selection:bg-[#e76f51]/30 lg:h-full lg:overflow-y-auto">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-80 mix-blend-multiply overflow-hidden z-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
        <Motion.div
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={shouldReduceMotion ? undefined : { duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] rounded-full bg-[#bc6c25] blur-[140px] opacity-20"
        />
        <Motion.div
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.1, 1], rotate: [0, -3, 3, 0] }}
          transition={shouldReduceMotion ? undefined : { duration: 30, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute -bottom-[20%] -left-[10%] w-[90vw] h-[90vw] max-w-[1400px] max-h-[1400px] rounded-full bg-[#2a9d8f] blur-[160px] opacity-15"
        />
      </div>

      <main className="relative z-10 w-full max-w-[1300px] grid gap-12 py-6 md:py-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div className="flex flex-col">
          <Motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[11px] md:text-xs font-semibold tracking-[0.25em] uppercase text-black/60 mb-6"
          >
            Pacific Northwest Edition · Proof of concept
          </Motion.p>
          <Motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-['Playfair_Display'] text-[17vw] leading-[0.85] tracking-[-0.04em] sm:text-[12vw] lg:text-[7rem] xl:text-[8rem] font-semibold uppercase text-[#0d2110]"
          >
            Field <br />
            <span className="italic text-black/80">Kitchen</span>
          </Motion.h1>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-xl"
          >
            <p className="font-['Playfair_Display'] text-3xl md:text-4xl leading-tight text-[#1a1a1a]">
              Make more of what&rsquo;s in your kitchen.
            </p>
            <p className="mt-4 text-base leading-relaxed text-black/70">
              Choose the ingredients you have on hand. Field Kitchen suggests dishes, sides, drinks and preserves you can make from them, with a short method, what else you&rsquo;ll need, and where each idea comes from.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                type="button"
                onClick={onStart}
                className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#1a1a1a] px-7 text-sm font-semibold tracking-wide text-[#faf9f6] shadow-lg transition-colors hover:bg-black"
              >
                Choose ingredients
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={onOpenSources}
                className="min-h-11 text-sm font-semibold text-black/70 underline decoration-black/25 underline-offset-4 hover:text-black"
              >
                How the data works
              </button>
            </div>
          </Motion.div>
        </div>

        <Motion.aside
          aria-label="About this edition"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-8 rounded-3xl border border-black/10 bg-white/55 p-6 backdrop-blur-md md:p-8"
        >
          <ol className="flex flex-col gap-5">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span aria-hidden="true" className="font-['Playfair_Display'] text-3xl italic leading-none text-[#b5401f]">{index + 1}</span>
                <span>
                  <span className="block font-semibold text-[#1a1a1a]">{step.title}</span>
                  <span className="block text-sm text-black/70">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="border-t border-black/10 pt-6">
            <div className="flex -space-x-2">
              {PREVIEW_IDS.map((id) => <IngredientThumb key={id} id={id} size={40} />)}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-black/70">
              {everydayCount} everyday ingredients and {specialtyCount} regional specialties · {PREPARATIONS.length} preparation ideas · nutrition from USDA FoodData Central and availability from an Oregon Department of Education chart.
            </p>
          </div>
        </Motion.aside>
      </main>
    </div>
  );
}
