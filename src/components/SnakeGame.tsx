import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_INCREMENT = 2;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const timerRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 0, y: -1 });
    setNextDirection({ x: 0, y: -1 });
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + nextDirection.x,
        y: head.y + nextDirection.y,
      };

      setDirection(nextDirection);

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        setIsPaused(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, food, gameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setNextDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setNextDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setNextDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setNextDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          if (gameOver) resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      timerRef.current = window.setInterval(moveSnake, speed);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [moveSnake, isPaused, gameOver, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Static Noise Effect (Pseudo)
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    // Food
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(food.x * size, food.y * size, size, size);
    
    // Food Glitch Layer
    if (Math.random() > 0.8) {
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(food.x * size + 2, food.y * size - 2, size, size);
    }

    // Snake
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#00ffff' : '#ff00ff';
      ctx.fillRect(
        segment.x * size,
        segment.y * size,
        size,
        size
      );
      
      // Glitch trail
      if (Math.random() > 0.95) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(segment.x * size + (Math.random() - 0.5) * 10, segment.y * size, size, 1);
      }
    });
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      <div className="flex justify-between w-full px-4 text-neon-cyan uppercase">
        <div className="flex flex-col items-start">
          <span className="text-[10px] opacity-50 tracking-tighter">DATALOAD::01</span>
          <span className="text-xl font-bold glitch-text">SCORE::{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] opacity-50 tracking-tighter">CORE::MEM</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-neon-magenta glitch-text">HI::{highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative group p-1 glitch-border bg-black overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black image-render-pixelated"
          style={{ opacity: gameOver ? 0.3 : 1, imageRendering: 'pixelated' }}
        />
        
        <AnimatePresence>
          {(isPaused || gameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-grayscale"
            >
              {gameOver ? (
                <div className="flex flex-col items-center gap-6 text-center">
                  <h2 className="text-5xl font-black text-neon-magenta glitch-text uppercase tracking-tighter">KERNAL_PANIC</h2>
                  <p className="text-neon-cyan text-xs tracking-[0.5em] mb-4">RECOVERY_FAILED // {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-neon-cyan text-black hover:bg-white hover:scale-105 active:scale-95 transition-all font-bold uppercase tracking-widest glitch-border"
                  >
                    REBOOT::0x01
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <h2 className="text-3xl font-bold text-white uppercase tracking-[0.2em] glitch-text">SYSTEM_HALTED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="flex h-20 w-20 items-center justify-center bg-neon-magenta text-black hover:scale-110 active:scale-90 transition-transform glitch-border"
                  >
                    <Play size={40} fill="currentColor" />
                  </button>
                  <p className="text-neon-cyan text-[10px] uppercase mt-4 tracking-[0.3em]">EXECUTE::RESUME</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Screen Tearing Simulator */}
        {!isPaused && !gameOver && (
           <motion.div 
             animate={{ top: ["0%", "100%", "0%"] }}
             transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
             className="absolute left-0 w-full h-[1px] bg-white opacity-20 pointer-events-none"
           />
        )}
      </div>

      <div className="flex gap-6">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="p-4 bg-neon-cyan/10 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors"
        >
          {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
        </button>
        <button 
          onClick={resetGame}
          className="p-4 bg-neon-magenta/10 border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-black transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
}
