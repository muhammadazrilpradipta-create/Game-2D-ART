/**
 * Victory Modal Overlay
 * ROBOT MINI GAMES: Tampil saat Robot Mini berhasil mencapai Inti Energi Emas di akhir level
 */

import React, { useMemo } from 'react';
import { Trophy, Star, RotateCcw, Home, Clock, Sparkles, Zap } from 'lucide-react';
import { GameStats } from '../types/game';
import { soundManager } from '../audio/soundManager';

interface VictoryModalProps {
  stats: GameStats;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stats,
  onPlayAgain,
  onMainMenu,
}) => {
  // Hitung jumlah bintang (1 - 3)
  const stars = useMemo(() => {
    const coinRate = stats.coinsCollected / Math.max(1, stats.totalCoins);
    if (coinRate >= 0.8) return 3;
    if (coinRate >= 0.45) return 2;
    return 1;
  }, [stats]);

  const isNewHighScore = stats.score > 0 && stats.score >= stats.highScore;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 text-center flex flex-col items-center">
        {/* Golden Energy Core & Crown Icon */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-4xl shadow-inner shadow-cyan-500/20 animate-pulse">
            ⚡
          </div>
          <span className="absolute -top-3 -right-2 text-2xl">👑</span>
        </div>

        <span className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase mb-1">
          ROBOT MINI GAMES
        </span>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-amber-300 tracking-wide mb-1">
          MISI SELESAI!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-4">
          Hebat! Robot Mini berhasil mengamankan Inti Energi Emas!
        </p>

        {/* Star Rating */}
        <div className="flex items-center gap-2 mb-5">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-2 rounded-2xl transition-all ${
                starIdx <= stars
                  ? 'bg-amber-400/20 border border-amber-400/40 text-amber-400 scale-110 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800 border border-slate-700 text-slate-600'
              }`}
            >
              <Star className="w-7 h-7 fill-current" />
            </div>
          ))}
        </div>

        {/* New High Score Badge */}
        {isNewHighScore && (
          <div className="mb-4 px-3 py-1 bg-amber-500/25 border border-amber-500/50 rounded-full text-amber-300 text-xs font-bold inline-flex items-center gap-1.5 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>REKOR SKOR BARU TERCAPAI!</span>
          </div>
        )}

        {/* Stats Card */}
        <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-3 text-left">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">Total Skor</span>
            <span className="font-mono text-2xl font-black text-amber-400 tabular-nums">
              {stats.score}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">High Score</span>
            <span className="font-mono text-2xl font-bold text-slate-200 tabular-nums">
              {stats.highScore}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">Koin Energi</span>
            <span className="font-mono text-sm font-semibold text-slate-300 tabular-nums">
              {stats.coinsCollected} / {stats.totalCoins}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400">Drone Dilumpuhkan</span>
            <span className="font-mono text-sm font-semibold text-cyan-300 tabular-nums">
              {stats.dronesDefeated} Unit
            </span>
          </div>

          <div className="col-span-2 flex items-center justify-between pt-1 border-t border-slate-700/60">
            <span className="text-[11px] text-slate-400">Waktu Petualangan:</span>
            <span className="font-mono text-xs font-semibold text-slate-300 flex items-center gap-1 tabular-nums">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              {Math.round(stats.levelTimer)} detik
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          {/* PLAY AGAIN BUTTON */}
          <button
            onClick={() => {
              soundManager.playClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-bold text-base shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>MAIN LAGI (PLAY AGAIN)</span>
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
            <span>MENU UTAMA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
