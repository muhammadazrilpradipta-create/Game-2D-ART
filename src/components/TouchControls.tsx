/**
 * Mobile Touch Controls Overlay
 * Virtual D-Pad (Kiri, Kanan) & Tombol Lompat
 */

import React, { useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface TouchControlsProps {
  onInput: (inputX: number, jumpHolding: boolean, jumpPressed: boolean) => void;
  visible?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onInput, visible = true }) => {
  const leftPressed = useRef(false);
  const rightPressed = useRef(false);
  const jumpHolding = useRef(false);

  const syncInput = useCallback((justJumped: boolean = false) => {
    let x = 0;
    if (leftPressed.current) x -= 1;
    if (rightPressed.current) x += 1;
    onInput(x, jumpHolding.current, justJumped);
  }, [onInput]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none flex flex-col justify-end p-4 pb-6 sm:pb-8">
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
        {/* Left / Right Buttons */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Tombol Kiri */}
          <button
            type="button"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900/75 active:bg-sky-600/80 active:scale-95 backdrop-blur-md border-2 border-white/20 text-white flex items-center justify-center shadow-2xl transition-transform touch-none"
            onTouchStart={(e) => {
              e.preventDefault();
              leftPressed.current = true;
              syncInput();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              leftPressed.current = false;
              syncInput();
            }}
            onMouseDown={() => {
              leftPressed.current = true;
              syncInput();
            }}
            onMouseUp={() => {
              leftPressed.current = false;
              syncInput();
            }}
            onMouseLeave={() => {
              leftPressed.current = false;
              syncInput();
            }}
            aria-label="Gerak Kiri"
          >
            <ArrowLeft className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>

          {/* Tombol Kanan */}
          <button
            type="button"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900/75 active:bg-sky-600/80 active:scale-95 backdrop-blur-md border-2 border-white/20 text-white flex items-center justify-center shadow-2xl transition-transform touch-none"
            onTouchStart={(e) => {
              e.preventDefault();
              rightPressed.current = true;
              syncInput();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              rightPressed.current = false;
              syncInput();
            }}
            onMouseDown={() => {
              rightPressed.current = true;
              syncInput();
            }}
            onMouseUp={() => {
              rightPressed.current = false;
              syncInput();
            }}
            onMouseLeave={() => {
              rightPressed.current = false;
              syncInput();
            }}
            aria-label="Gerak Kanan"
          >
            <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        </div>

        {/* Jump Button */}
        <div className="pointer-events-auto">
          <button
            type="button"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-amber-500/85 active:bg-amber-600 active:scale-95 backdrop-blur-md border-2 border-amber-300 text-white flex flex-col items-center justify-center shadow-2xl transition-transform touch-none"
            onTouchStart={(e) => {
              e.preventDefault();
              jumpHolding.current = true;
              syncInput(true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              jumpHolding.current = false;
              syncInput(false);
            }}
            onMouseDown={() => {
              jumpHolding.current = true;
              syncInput(true);
            }}
            onMouseUp={() => {
              jumpHolding.current = false;
              syncInput(false);
            }}
            onMouseLeave={() => {
              jumpHolding.current = false;
              syncInput(false);
            }}
            aria-label="Lompat"
          >
            <ArrowUp className="w-9 h-9 sm:w-11 sm:h-11" />
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase -mt-1">Lompat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
