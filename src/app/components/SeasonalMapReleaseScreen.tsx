import { motion as Motion } from "motion/react";
import { MoveUpRight } from "lucide-react";

export function SeasonalMapReleaseScreen() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#eaf4eb] flex flex-col p-8 md:p-16 text-[#0d2110]">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <Motion.div 
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 0.7, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-[#dcedc1] blur-[120px] mix-blend-multiply" 
        />
        <Motion.div 
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 0.6, x: 0 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-[#a8e6cf] blur-[100px] mix-blend-multiply" 
        />
        <Motion.div 
          initial={{ opacity: 0, scale: 1.2 }}
          whileInView={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="absolute top-[20%] right-[30%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[#ffaaa5] blur-[120px] mix-blend-multiply" 
        />
      </div>

      <header className="relative z-10 flex justify-between items-start font-['Space_Grotesk'] text-xs tracking-widest uppercase text-[#0d2110]/60">
        <Motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col gap-1"
        >
          <span>Feature Extension</span>
          <span>Field Kitchen — 2.4</span>
        </Motion.div>
        <Motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex items-center gap-2"
        >
          <span>Available Now</span>
          <MoveUpRight className="w-4 h-4" />
        </Motion.div>
      </header>

      <main className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 mt-12 md:mt-24 max-w-7xl mx-auto w-full">
        {/* Typographic Title Area */}
        <div className="md:col-span-10 md:col-start-2 relative flex flex-col justify-center items-end text-right">
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="font-['Playfair_Display'] text-[14vw] sm:text-[12vw] md:text-[8rem] lg:text-[11rem] leading-[0.85] tracking-[-0.03em] text-[#0d2110] uppercase font-bold mix-blend-color-burn"
          >
            Seasonal<br />Map Mode
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-8 font-['Space_Grotesk'] text-lg md:text-3xl font-light tracking-[0.05em] text-[#0d2110]/80 italic mix-blend-color-burn pr-4 md:pr-12"
          >
            Spatial Ingredient Explorer
          </Motion.div>

          {/* Metadata Labels intercut with the text */}
          <Motion.div
            initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
            whileInView={{ opacity: 1, rotate: -8, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="absolute top-[0%] right-[60%] md:right-[65%] font-['Space_Grotesk'] text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#2d6a4f] uppercase border border-[#2d6a4f]/40 px-4 py-1.5 rounded-full backdrop-blur-md bg-[#eaf4eb]/70 shadow-sm"
          >
            Region Filter Enabled
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, rotate: 15, scale: 0.8 }}
            whileInView={{ opacity: 1, rotate: 12, scale: 1 }}
            transition={{ delay: 1, duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="absolute top-[35%] right-[85%] md:right-[75%] font-['Space_Grotesk'] text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#d84b2a] uppercase border border-[#d84b2a]/40 px-4 py-1.5 rounded-full backdrop-blur-md bg-[#eaf4eb]/70 shadow-sm"
          >
            Harvest Window Active
          </Motion.div>
          
          <Motion.div
            initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
            whileInView={{ opacity: 1, rotate: -6, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="absolute bottom-[-10%] right-[40%] md:right-[45%] font-['Space_Grotesk'] text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#f4a261] uppercase border border-[#f4a261]/40 px-4 py-1.5 rounded-full backdrop-blur-md bg-[#eaf4eb]/70 shadow-sm"
          >
            Local Source Priority
          </Motion.div>
        </div>
      </main>

      <footer className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end pb-8">
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1 }}
          viewport={{ once: true }}
          className="md:col-span-8 lg:col-span-6 lg:col-start-7 font-['Space_Grotesk'] text-sm md:text-base leading-relaxed text-[#0d2110]/80 font-normal border-l border-[#0d2110]/20 pl-6"
        >
          <p>
            The system visualizes ingredient availability across time, geography, and preparation compatibility. An experimental culinary interface designed to map regional networks directly to your kitchen surface.
          </p>
        </Motion.div>
      </footer>
    </div>
  );
}
