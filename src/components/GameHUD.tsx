/**
 * Game HUD Component
 * ROBOT MINI GAMES: ROBOT HP Bar Slider dengan Handle Robot Mini & Indikator Skor Energi
 */

import React, { useMemo } from 'react';
import { Pause, Trophy, Zap } from 'lucide-react';
import { GameStats } from '../types/game';

interface GameHUDProps {
  health: number;
  stats: GameStats;
  playerX: number;
  worldWidth: number;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  health,
  stats,
  playerX,
  worldWidth,
  onPause,
}) => {
  // Hitung persentase health
  const hpPercent = Math.max(0, Math.min(100, health));

  // Tentukan warna bar dinamis:
  // Cyan/Emerald saat HP tinggi, Kuning saat menurun, Merah saat kritis
  const healthColor = useMemo(() => {
    if (hpPercent > 50) return 'bg-cyan-400 shadow-cyan-400/50';
    if (hpPercent > 25) return 'bg-amber-400 shadow-amber-400/50';
    return 'bg-rose-500 shadow-rose-500/50 animate-pulse';
  }, [hpPercent]);

  // Hitung progres perjalanan robot mini menuju Inti Energi (0 - 100%)
  const progressPercent = Math.max(0, Math.min(100, Math.round((playerX / (worldWidth - 200)) * 100)));

  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-4 pointer-events-none flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto w-full">
        {/* Left: ROBOT HP Bar Slider dengan Handle Robot Mini */}
        <div className="flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-950/20 pointer-events-auto">
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Zap className="w-4 h-4 fill-current" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-cyan-200 tracking-wider text-[11px] font-bold">ROBOT HP</span>
              <span className="font-mono tabular-nums text-slate-100 font-bold">{health}/100</span>
            </div>

            {/* Health Bar Track with Robot Handle */}
            <div className="relative w-32 sm:w-44 h-4 bg-slate-950/90 rounded-full overflow-visible border border-slate-700/80 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ease-out shadow-sm ${healthColor}`}
                style={{ width: `${hpPercent}%` }}
              />

              {/* Handle Icon Robot Mini di ujung slider */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 -ml-3 bg-slate-900 rounded-full border-2 border-cyan-400 shadow-md flex items-center justify-center transition-all duration-300 ease-out"
                style={{ left: `${hpPercent}%` }}
                title="Handle Robot HP"
              >
                {/* Mini robot icon */}
                <span className="text-[12px] leading-none select-none">🤖</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Level Distance Progress */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/30 text-xs">
          <span className="text-slate-400">Jarak:</span>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-cyan-400 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-cyan-300 tabular-nums">{progressPercent}%</span>
          <span className="text-xs">⚡</span>
        </div>

        {/* Right: Score Counter & Pause Button */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Score Box */}
          <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-950/20">
            {/* Koin Counter */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-black text-amber-900 leading-none">$</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-amber-300/80 font-medium leading-none">Skor</span>
                <span className="font-mono font-bold text-amber-300 text-sm sm:text-base leading-tight tabular-nums">
                  {stats.score}
                </span>
              </div>
            </div>

            <div className="w-[1px] h-6 bg-slate-700/70" />

            {/* Coins count */}
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] text-slate-400 leading-none">Koin</span>
              <span className="font-mono text-xs text-slate-200 font-semibold tabular-nums">
                {stats.coinsCollected}/{stats.totalCoins}
              </span>
            </div>

            {/* Highscore */}
            <div className="hidden lg:flex items-center gap-1 text-slate-400 text-xs pl-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono tabular-nums text-amber-200 font-medium">{stats.highScore}</span>
            </div>
          </div>

          {/* Pause Button */}
          <button
            onClick={onPause}
            className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-slate-200 border border-cyan-500/30 shadow-lg flex items-center justify-center transition-all cursor-pointer"
            title="Jeda Permainan (Escape)"
            aria-label="Pause Game"
          >
            <Pause className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </header>
  );
};
