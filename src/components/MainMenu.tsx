/**
 * Main Menu Component
 * ROBOT MINI GAMES
 * Sesuai Jobsheet 5 (SceneMenu, BtnStart, BtnOption, BtnQuit)
 */

import React, { useState } from 'react';
import { Play, Settings, Sliders, LogOut, Trophy, Sparkles, Cpu } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface MainMenuProps {
  highScore: number;
  onPlay: () => void;
  onOptions: () => void;
  onOpenLab: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  highScore,
  onPlay,
  onOptions,
  onOpenLab,
}) => {
  const [showQuitModal, setShowQuitModal] = useState(false);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900/95 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 text-center flex flex-col items-center">
        {/* Decorative Futuristic Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Game Platformer 2D Cyber Edition</span>
        </div>

        {/* Mascot Robot Mini Avatar / Graphic */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-b from-sky-400 via-blue-600 to-slate-900 p-2 shadow-lg shadow-cyan-500/30 border-2 border-cyan-400/60 flex items-center justify-center select-none animate-bounce">
            <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow">
              {/* Antenna */}
              <line x1="50" y1="20" x2="50" y2="8" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
              <circle cx="50" cy="8" r="5" fill="#22D3EE" />
              {/* Head */}
              <rect x="20" y="20" width="60" height="48" rx="14" fill="#0284C7" stroke="#0369A1" strokeWidth="3" />
              {/* Visor */}
              <rect x="28" y="30" width="44" height="26" rx="8" fill="#0F172A" />
              {/* Glowing Eyes */}
              <circle cx="40" cy="43" r="5.5" fill="#22D3EE" />
              <circle cx="42" cy="41" r="1.8" fill="#FFFFFF" />
              <circle cx="60" cy="43" r="5.5" fill="#22D3EE" />
              <circle cx="62" cy="41" r="1.8" fill="#FFFFFF" />
              {/* Ears */}
              <rect x="14" y="34" width="6" height="16" rx="3" fill="#0369A1" />
              <rect x="80" y="34" width="6" height="16" rx="3" fill="#0369A1" />
              {/* Body */}
              <rect x="34" y="70" width="32" height="22" rx="6" fill="#0369A1" />
              <circle cx="50" cy="80" r="4.5" fill="#38BDF8" />
            </svg>
          </div>
          <span className="absolute -bottom-1 -right-2 bg-cyan-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-md">
            v2.0 Robot
          </span>
        </div>

        {/* Game Title: ROBOT MINI GAMES */}
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 tracking-wider drop-shadow-sm mb-1 uppercase">
          ROBOT MINI GAMES
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm font-medium mb-6">
          Kumpulkan Koin Energi, Lumpuhkan Robot Drone Musuh & Amankan Inti Daya!
        </p>

        {/* High Score Card */}
        <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl py-2.5 px-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>High Score Tertinggi</span>
          </div>
          <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
            {highScore} Poin
          </span>
        </div>

        {/* Menu Buttons (BtnStart, BtnOption, BtnQuit sesuai Jobsheet 5 hal 46-52) */}
        <div className="flex flex-col gap-3 w-full">
          {/* PLAY BUTTON (BtnStart -> MulaiGame()) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onPlay();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-bold text-base sm:text-lg shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>MULAI MAIN (PLAY)</span>
          </button>

          {/* JOBSHEET LAB (Eksperimen Fisika SMK: Ms, Jf, Gravity) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenLab();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-750 active:scale-98 text-cyan-300 font-semibold text-sm sm:text-base border border-cyan-500/30 shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>LAB FISIKA JOBSHEET (Ms & Jf)</span>
          </button>

          {/* OPTIONS BUTTON (BtnOption) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOptions();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-semibold text-sm sm:text-base border border-slate-700 shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-300" />
            <span>PENGATURAN (OPTIONS)</span>
          </button>

          {/* QUIT BUTTON (BtnQuit -> ExitGame()) */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowQuitModal(true);
            }}
            className="w-full py-2.5 px-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 active:scale-98 text-slate-400 hover:text-slate-200 font-medium text-xs sm:text-sm border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>KELUAR (QUIT)</span>
          </button>
        </div>

        {/* Quick controls reminder */}
        <div className="mt-5 text-[11px] text-slate-400">
          Gunakan <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-cyan-300 font-mono">A</kbd>/<kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-cyan-300 font-mono">D</kbd> atau Panah untuk bergerak, <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-cyan-300 font-mono">SPACE</kbd> untuk lompat thruster.
        </div>

        {/* Quit Confirmation Dialog (Browser-Friendly Exit Handling) */}
        {showQuitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center shadow-2xl">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Ingin Keluar Permainan?</h3>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                ROBOT MINI GAMES berjalan langsung di browser web Anda. Anda dapat menutup tab kapan saja. Skor tertinggi tersimpan otomatis!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowQuitModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Kembali ke Menu
                </button>
                <button
                  onClick={() => {
                    setShowQuitModal(false);
                    try {
                      window.close();
                    } catch {
                      // Safely handled
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Tutup Sesi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
