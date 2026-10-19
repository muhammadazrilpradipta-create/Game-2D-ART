/**
 * Jobsheet Physics Lab Modal
 * Mempraktikkan pertanyaan Jobsheet 1 halaman 9:
 * "Apa yang terjadi apabila nilai dari parameter Ms, Jf, dan Gravity Scale diubah?"
 */

import React from 'react';
import { Sliders, RotateCcw, Play, Check, BookOpen } from 'lucide-react';
import { GameSettings } from '../types/game';
import { soundManager } from '../audio/soundManager';

interface JobsheetLabModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onApplyAndPlay: () => void;
  onClose: () => void;
}

export const JobsheetLabModal: React.FC<JobsheetLabModalProps> = ({
  settings,
  onUpdateSettings,
  onApplyAndPlay,
  onClose,
}) => {
  const handleMsChange = (val: number) => {
    onUpdateSettings({ ...settings, moveSpeed: val });
  };

  const handleJfChange = (val: number) => {
    onUpdateSettings({ ...settings, jumpForce: val });
  };

  const handleGravityChange = (val: number) => {
    onUpdateSettings({ ...settings, gravityScale: val });
  };

  const applyPreset = (preset: 'standard' | 'moon' | 'speedy' | 'heavy') => {
    soundManager.playClick();
    if (preset === 'standard') {
      onUpdateSettings({ ...settings, moveSpeed: 180, jumpForce: 480, gravityScale: 1.0 });
    } else if (preset === 'moon') {
      onUpdateSettings({ ...settings, moveSpeed: 190, jumpForce: 440, gravityScale: 0.45 });
    } else if (preset === 'speedy') {
      onUpdateSettings({ ...settings, moveSpeed: 290, jumpForce: 520, gravityScale: 1.1 });
    } else if (preset === 'heavy') {
      onUpdateSettings({ ...settings, moveSpeed: 140, jumpForce: 560, gravityScale: 1.8 });
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-sky-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Lab Fisika Jobsheet 1</h2>
              <p className="text-xs text-slate-400">Eksperimen Nilai Parameter Rigidbody2D & C# Script</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* Kurikulum Jobsheet Note */}
        <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-800/60 mb-5 text-xs text-sky-200 leading-relaxed">
          <span className="font-bold text-sky-300">Pertanyaan Praktik Jobsheet 1 (Halaman 9):</span>
          <br />
          <em>"Apa yang terjadi apabila nilai dari parameter Ms, Jf, dan Gravity Scale diubah?"</em>
          <br />
          Cobalah geser slider di bawah ini, lalu jalankan game untuk merasakan perubahan fisika gerak robot secara langsung!
        </div>

        {/* Preset Buttons */}
        <div className="mb-5">
          <span className="text-xs font-semibold text-slate-300 mb-2 block">Pilihan Preset Cepat:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => applyPreset('standard')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
            >
              Standar SMK
            </button>
            <button
              onClick={() => applyPreset('moon')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
            >
              🌙 Gravitasi Bulan
            </button>
            <button
              onClick={() => applyPreset('speedy')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
            >
              ⚡ Robot Cepat
            </button>
            <button
              onClick={() => applyPreset('heavy')}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
            >
              🪨 Robot Berat Logam
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Parameter 1: Ms (Move Speed) */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-200">Parameter Ms (Kecepatan Gerak Kanan-Kiri)</span>
                <p className="text-[11px] text-slate-400">Jobsheet 1 Langkah 6-7: <code>Rb.velocity = new Vector2(ms * horiz, ...)</code></p>
              </div>
              <span className="font-mono text-sm font-bold text-sky-400 tabular-nums">
                {settings.moveSpeed}
              </span>
            </div>
            <input
              type="range"
              min="90"
              max="320"
              step="10"
              value={settings.moveSpeed}
              onChange={(e) => handleMsChange(parseInt(e.target.value))}
              className="w-full accent-sky-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Parameter 2: Jf (Jump Force) */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-200">Parameter Jf (Kekuatan Melompat)</span>
                <p className="text-[11px] text-slate-400">Jobsheet 1 Langkah 11-12: <code>Rb.AddForce(new Vector2(0, jf))</code></p>
              </div>
              <span className="font-mono text-sm font-bold text-amber-400 tabular-nums">
                {settings.jumpForce}
              </span>
            </div>
            <input
              type="range"
              min="280"
              max="650"
              step="15"
              value={settings.jumpForce}
              onChange={(e) => handleJfChange(parseInt(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Parameter 3: Gravity Scale */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-200">Parameter Gravity Scale (Skala Gravitasi)</span>
                <p className="text-[11px] text-slate-400">Komponen Rigidbody2D: Menentukan seberapa cepat robot jatuh kembali ke tanah</p>
              </div>
              <span className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
                {settings.gravityScale.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2.2"
              step="0.05"
              value={settings.gravityScale}
              onChange={(e) => handleGravityChange(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              applyPreset('standard');
            }}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-300 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Standar</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onApplyAndPlay();
            }}
            className="flex-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Terapkan & Mainkan!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
