/**
 * Options Menu Component
 * Sesuai Jobsheet 5 (MenuOption)
 * Pengaturan Audio, Kontrol, dan Penyimpanan LocalStorage
 */

import React from 'react';
import { Volume2, VolumeX, Music, Smartphone, ArrowLeft, Gamepad2, Play } from 'lucide-react';
import { GameSettings } from '../types/game';
import { soundManager } from '../audio/soundManager';

interface OptionsMenuProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onBack: () => void;
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({
  settings,
  onUpdateSettings,
  onBack,
}) => {
  const handleBgmChange = (val: number) => {
    const updated = { ...settings, bgmVolume: val };
    onUpdateSettings(updated);
  };

  const handleSfxChange = (val: number) => {
    const updated = { ...settings, sfxVolume: val };
    onUpdateSettings(updated);
  };

  const handleMuteToggle = () => {
    const updated = { ...settings, isMuted: !settings.isMuted };
    onUpdateSettings(updated);
  };

  const handleTouchToggle = () => {
    const updated = { ...settings, touchControlsVisible: !settings.touchControlsVisible };
    onUpdateSettings(updated);
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              ⚙️
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Pengaturan (Options)</h2>
              <p className="text-xs text-slate-400">Audio, Kontrol, & Tampilan Game</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Section */}
        <div className="flex flex-col gap-5 mb-6">
          {/* Mute Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-3">
              {settings.isMuted ? (
                <VolumeX className="w-5 h-5 text-rose-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              )}
              <div>
                <span className="text-sm font-semibold text-slate-200">Suara Keseluruhan</span>
                <p className="text-xs text-slate-400">
                  {settings.isMuted ? 'Status: Dibisukan (Mute)' : 'Status: Aktif'}
                </p>
              </div>
            </div>

            <button
              onClick={handleMuteToggle}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                settings.isMuted
                  ? 'bg-rose-600 text-white shadow-rose-900/30'
                  : 'bg-emerald-600 text-white shadow-emerald-900/30'
              }`}
            >
              {settings.isMuted ? 'UNMUTE' : 'MUTE'}
            </button>
          </div>

          {/* Music Volume */}
          <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
                <Music className="w-4 h-4 text-sky-400" />
                <span>Volume Musik Latar (BGM)</span>
              </div>
              <span className="font-mono text-xs font-bold text-sky-400 tabular-nums">
                {Math.round(settings.bgmVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.bgmVolume}
              onChange={(e) => handleBgmChange(parseFloat(e.target.value))}
              disabled={settings.isMuted}
              className="w-full accent-sky-400 h-2 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* SFX Volume & Test Button */}
          <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Volume Efek Suara (SFX)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => soundManager.playCoin()}
                  className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Uji Bunyi</span>
                </button>
                <span className="font-mono text-xs font-bold text-amber-400 tabular-nums">
                  {Math.round(settings.sfxVolume * 100)}%
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => handleSfxChange(parseFloat(e.target.value))}
              disabled={settings.isMuted}
              className="w-full accent-amber-400 h-2 bg-slate-700 rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Touch Controls Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-sm font-medium text-slate-200">Tombol Sentuh di Layar</span>
                <p className="text-[11px] text-slate-400">Virtual D-Pad untuk perangkat layar sentuh / mobile</p>
              </div>
            </div>
            <button
              onClick={handleTouchToggle}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                settings.touchControlsVisible
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {settings.touchControlsVisible ? 'AKTIF' : 'NONAKTIF'}
            </button>
          </div>
        </div>

        {/* Controls Reference Card */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 mb-6 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-2">
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span>Panduan Tombol Kontrol:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400">Gerak Kiri / Kanan:</span>{' '}
              <span className="text-slate-100 font-bold">A / D / Panah</span>
            </div>
            <div>
              <span className="text-slate-400">Melompat:</span>{' '}
              <span className="text-slate-100 font-bold">SPACE / Panah Atas</span>
            </div>
            <div>
              <span className="text-slate-400">Jeda Permainan:</span>{' '}
              <span className="text-slate-100 font-bold">ESCAPE</span>
            </div>
            <div>
              <span className="text-slate-400">Lumpuhkan Drone:</span>{' '}
              <span className="text-slate-100 font-bold">Injak dari atas!</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>KEMBALI KE MENU</span>
        </button>
      </div>
    </div>
  );
};
