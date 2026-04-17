import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Synthwave Dreams",
    artist: "AI Gen: Cyber Pulse",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00f3ff",
  },
  {
    id: 2,
    title: "Neon Nights",
    artist: "AI Gen: Vapor Vibes",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff",
  },
  {
    id: 3,
    title: "Circuit Breaker",
    artist: "AI Gen: Bit Master",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#9d00ff",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Playback blocked:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (total) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-8 overflow-hidden bg-black relative">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-10">
        {/* Abstract Pixel Visualization */}
        <div className="relative w-56 h-56 md:w-64 md:h-64 glitch-border bg-black group overflow-hidden">
           <AnimatePresence mode="wait">
            <motion.div 
              key={currentTrackIndex}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
               <Music size={80} className="text-neon-cyan opacity-40 glitch-text" />
            </motion.div>
           </AnimatePresence>

           {/* Static Noise Overlay */}
           <div className="absolute inset-0 static-noise opacity-30" />

           {/* Orbiting Pixel Bits */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="absolute inset-2 border-2 border-dashed border-neon-magenta/30 rounded-full"
           />
           
           <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div 
                className="w-full h-full opacity-40 mix-blend-screen"
                style={{ 
                  background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${currentTrack.color} 10px, ${currentTrack.color} 20px)` 
                }} 
              />
           </div>
        </div>

        {/* Track Info */}
        <div className="text-center space-y-4">
          <motion.div 
            key={currentTrack.title}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-1"
          >
            <h3 className="text-2xl font-bold text-white uppercase tracking-tighter glitch-text">
              {currentTrack.title}
            </h3>
            <p 
              className="text-xs font-mono uppercase tracking-[0.4em]"
              style={{ color: currentTrack.color }}
            >
              SOURCE::{currentTrack.artist}
            </p>
          </motion.div>
        </div>

        {/* Binary Visualizer (Pseudo) */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-[200px] opacity-60">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                opacity: isPlaying ? [0.2, 1, 0.2] : 0.2
              }}
              transition={{ 
                duration: 0.2, 
                delay: i * 0.05,
                repeat: Infinity 
              }}
              className="text-[10px] font-mono text-neon-cyan"
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Controls Container */}
      <div className="glitch-border bg-black/50 p-8 w-full max-w-sm mx-auto flex flex-col gap-8">
        {/* Hard-edged Progress Bar */}
        <div className="relative h-4 bg-neon-cyan/10 border border-neon-cyan/30 w-full overflow-hidden">
           <div 
             className="absolute h-full bg-neon-magenta" 
             style={{ width: `${progress}%`, transition: 'width 0.1s linear' }} 
           />
           {/* Progress artifacts */}
           <div className="absolute top-0 left-0 w-full h-full flex justify-between pointer-events-none">
              {[...Array(10)].map((_, i) => <div key={i} className="w-[1px] h-full bg-black/50" />)}
           </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between">
           <button 
             onClick={prevTrack}
             className="text-neon-cyan hover:text-white hover:scale-110 active:scale-90 transition-all p-2 glitch-border border-neon-cyan/20"
           >
             <SkipBack size={24} fill="currentColor" />
           </button>
           
           <button 
             onClick={togglePlay}
             className="w-20 h-20 bg-neon-magenta text-black flex items-center justify-center transition-all hover:bg-neon-cyan active:scale-95 glitch-border"
           >
             {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} className="ml-2" fill="currentColor" />}
           </button>

           <button 
             onClick={nextTrack}
             className="text-neon-cyan hover:text-white hover:scale-110 active:scale-90 transition-all p-2 glitch-border border-neon-cyan/20"
           >
             <SkipForward size={24} fill="currentColor" />
           </button>
        </div>

        {/* Bitrate indicator */}
        <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-neon-magenta">
           <span>BITRATE::512KBPS</span>
           <span className="animate-pulse">STREAMING::0xFA</span>
        </div>
      </div>
    </div>
  );
}
