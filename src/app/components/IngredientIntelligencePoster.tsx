import { motion as Motion } from "motion/react";
import { ArrowDown } from "lucide-react";

export function IngredientIntelligencePoster() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#faf9f6] flex flex-col justify-between p-8 md:p-16 border-b border-black/10">
      {/* Background Texture & Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-80 mix-blend-multiply">
        {/* Subtle noise/grain using SVG filter or CSS background */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
        
        {/* Soft Organic Gradient Shapes */}
        <Motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-[#f4a261] blur-[100px] mix-blend-multiply" 
        />
        <Motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-[#e76f51] blur-[120px] mix-blend-multiply" 
        />
        <Motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 2, delay: 1, ease: "easeOut" }}
          className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[#2a9d8f] blur-[100px] mix-blend-multiply" 
        />
      </div>

      {/* Top Metadata */}
      <header className="relative z-10 flex justify-between items-start font-['Space_Grotesk'] text-xs tracking-widest uppercase text-black/60">
        <Motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col gap-1"
        >
          <span>System Version 2.4</span>
          <span>Food Intelligence</span>
        </Motion.div>
        <Motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="flex flex-col gap-1 text-right"
        >
          <span>Release Note — 001</span>
          <span>Core Module</span>
        </Motion.div>
      </header>

      {/* Main Title Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-start pt-10 md:pt-20">
        <div className="relative w-full max-w-7xl mx-auto">
          <Motion.h1 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-['Playfair_Display'] text-[15vw] sm:text-[14vw] md:text-[11rem] lg:text-[15rem] leading-[0.8] tracking-[-0.04em] text-[#1a1a1a] uppercase font-semibold mix-blend-color-burn"
          >
            Field<br />Kitchen
          </Motion.h1>
          
          {/* Metadata Labels intercut with the text */}
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute top-[8%] left-[45%] md:left-[35%] font-['Space_Grotesk'] text-[10px] md:text-xs font-semibold tracking-[0.2em] text-[#d84b2a] uppercase border border-[#d84b2a]/30 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/40 shadow-sm rotate-[-4deg]"
          >
            Seasonal Index
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-[25%] right-[5%] md:right-[20%] font-['Space_Grotesk'] text-[10px] md:text-xs font-semibold tracking-[0.2em] text-[#2a9d8f] uppercase border border-[#2a9d8f]/30 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/40 shadow-sm rotate-[3deg]"
          >
            Source Map Active
          </Motion.div>
          
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="absolute bottom-[-15%] md:bottom-[-5%] left-[20%] md:left-[25%] font-['Space_Grotesk'] text-[10px] md:text-xs font-semibold tracking-[0.2em] text-[#f4a261] uppercase border border-[#f4a261]/30 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/40 shadow-sm rotate-[-1deg]"
          >
            Nutrient Profile Mode
          </Motion.div>
        </div>
      </main>

      {/* Footer Area with Secondary Caption */}
      <footer className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <Motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="md:col-span-4 lg:col-span-3 font-['Space_Grotesk'] text-sm text-black/50 uppercase tracking-widest"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#e76f51]" />
            <span>System Online</span>
          </div>
          <p className="max-w-[200px] text-xs">A spatial ingredient guidance system designed for exploration.</p>
        </Motion.div>
        
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="md:col-span-8 lg:col-span-6 lg:col-start-7 font-['Space_Grotesk'] text-base md:text-lg leading-relaxed text-black/80 font-light"
        >
          <p>
            An intelligent interface designed to help users explore sourcing quality, preparation methods, and nutritional structure across dynamic, seasonal food networks. Built for literacy, crafted for the kitchen.
          </p>
        </Motion.div>
      </footer>
      
      {/* Scroll indicator */}
      <Motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 right-8 animate-bounce text-black/40"
      >
        <ArrowDown className="w-5 h-5" />
      </Motion.div>
    </div>
  );
}
