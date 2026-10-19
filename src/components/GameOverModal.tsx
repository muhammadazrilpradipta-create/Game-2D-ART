/**
 * Game Over Modal Overlay
 * ROBOT MINI GAMES: Tampil saat ROBOT HP mencapai 0 atau robot jatuh ke jurang
 */

import React from 'react';
import { RotateCcw, Home, Trophy, BatteryLow } from 'lucide-react';
import { GameStats } from '../types/game';
import { soundManager } from '../audio/soundManager';

interface GameOverModalProps {
  stats: GameStats;
  onRetry: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onRetry,
  onMainMenu,
}) => {
  const isNewHighScore = stats.score > 0 && stats.score >= stats.highScore;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-rose-600/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center">
        {/* Battery Low / Deactivated Robot Icon */}
        <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3 shadow-inner">
          <BatteryLow className="w-9 h-9" />
        </div>

        <span className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase mb-1">
          ROBOT MINI GAMES
        </span>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-600 tracking-wide mb-1">
          GAME OVER
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-5">
          Robot Mini kehabisan daya (ROBOT HP: 0) atau terperosok ke dalam jurang!
        </p>

        {/* New High Score Badge */}
        {isNewHighScore && (
          <div className="mb-4 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold inline-flex items-center gap-1.5 animate-pulse">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>REKOR BARU TERCIPTA!</span>
          </div>
        )}

        {/* Stats Summary Card */}
        <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-3 text-left">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">Skor Akhir</span>
            <span className="font-mono text-xl font-black text-amber-400 tabular-nums">
              {stats.score}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">High Score</span>
            <span className="font-mono text-xl font-bold text-slate-200 tabular-nums">
              {stats.highScore}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">Koin Diambil</span>
            <span className="font-mono text-sm font-semibold text-slate-300 tabular-nums">
              {stats.coinsCollected} / {stats.totalCoins}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">Drone Dilumpuhkan</span>
            <span className="font-mono text-sm font-semibold text-slate-300 tabular-nums">
              {stats.dronesDefeated} Unit
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          {/* RETRY BUTTON */}
          <button
            onClick={() => {
              soundManager.playClick();
              onRetry();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-bold text-base shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>COBA LAGI (RETRY)</span>
          </button>

          {/* MAIN MENU BUTTON */}
          <button
            onClick={() => {
              soundManager.playClick();
              onMainMenu();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>KEMBALI KE MENU UTAMA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
