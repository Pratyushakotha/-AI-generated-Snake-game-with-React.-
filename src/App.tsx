import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-black p-6 gap-6 overflow-hidden relative border-[12px] border-black">
      {/* Glitch Overlay */}
      <div className="absolute inset-0 static-noise z-50 mix-blend-overlay" />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-neon-cyan/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-neon-magenta/10 blur-[150px]" />
      </div>

      {/* Snake Section - Left/Center */}
      <section className="flex-1 flex flex-col items-center justify-center bg-black/40 glitch-border p-8 relative z-10 transition-transform hover:skew-x-1">
        <div className="absolute top-6 left-8 flex items-center gap-4">
           <div className="w-1 h-8 bg-neon-cyan animate-pulse" />
           <span className="text-[12px] uppercase font-mono tracking-[0.5em] text-neon-cyan">PROCESSOR::V_CORE_ALPHA</span>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full flex items-center justify-center"
        >
          <SnakeGame />
        </motion.div>

        <div className="absolute bottom-6 right-8 text-right">
           <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-neon-magenta/50">INPUT_REQUIRED [SPACE_BUFFER]</span>
        </div>
      </section>

      {/* Music Section - Right/Side */}
      <aside className="w-full md:w-[450px] flex flex-col bg-black/40 glitch-border border-neon-magenta/30 relative z-10 overflow-hidden">
        <div className="absolute top-6 left-8 flex items-center gap-4">
           <div className="w-8 h-1 bg-neon-magenta animate-pulse" />
           <span className="text-[12px] uppercase font-mono tracking-[0.5em] text-neon-magenta">SYNTH::NEURAL_OUTPUT</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <MusicPlayer />
        </motion.div>
      </aside>

      {/* Cryptic HUD Labels */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-8 text-[10px] uppercase tracking-[0.8em] text-white/10 z-20 pointer-events-none">
         <span>AUTH::USER_LOCAL</span>
         <span>SECURE_CONNECTION::FALSE</span>
         <span>SESSION::0x7F2</span>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[10px] uppercase tracking-[0.5em] text-neon-cyan/30 z-20 pointer-events-none">
         <span className="glitch-text">GLITCH_V1.A</span>
         <div className="w-1 h-1 bg-neon-magenta rounded-full animate-bounce" />
         <span>OVERWRITE::SUCCESS</span>
      </div>
    </main>
  );
}
