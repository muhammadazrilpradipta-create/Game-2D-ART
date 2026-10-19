/**
 * Pause Modal Overlay
 * ROBOT MINI GAMES: Menghentikan sementara pergerakan sistem & robot
 */

import React from 'react';
import { Play, RotateCcw, Settings, Home, Cpu } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onOptions: () => void;
  onMainMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onOptions,
  onMainMenu,
}) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/40 text-center flex flex-col items-center">
        {/* Robot Core Icon */}
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mb-3 shadow-inner">
          <Cpu className="w-7 h-7" />
        </div>

        <span className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase mb-1">
          ROBOT MINI GAMES
        </span>
        <h2 className="text-2xl font-black text-slate-100 tracking-wide mb-1">
          SISTEM DIJEDA
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Seluruh pergerakan robot mini dan drone musuh dihentikan
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          {/* Lanjutkan (Resume) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onResume();
            }}
            className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-bold text-sm shadow-lg shadow-cyan-950/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>LANJUTKAN (RESUME)</span>
          </button>

          {/* Ulangi (Restart) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="w-full py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ULANGI LEVEL (RETRY)</span>
          </button>

          {/* Pengaturan (Options) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOptions();
            }}
            className="w-full py-2.5 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 active:scale-98 text-slate-300 font-semibold text-xs sm:text-sm border border-slate-700/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>PENGATURAN (OPTIONS)</span>
          </button>

          {/* Menu Utama (Main Menu) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onMainMenu();
            }}
            className="w-full py-2.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-slate-400 hover:text-slate-200 font-medium text-xs border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>MENU UTAMA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
