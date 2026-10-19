/**
 * Chicken Adventure - Main Application Entry
 * Platformer 2D Komprehensif Sesuai GDD & Kurikulum Jobsheet 1-5 SMK
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/gameEngine';
import { GameSettings, GameState, GameStats } from './types/game';
import { soundManager } from './audio/soundManager';
import { GameHUD } from './components/GameHUD';
import { TouchControls } from './components/TouchControls';
import { MainMenu } from './components/MainMenu';
import { OptionsMenu } from './components/OptionsMenu';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { JobsheetLabModal } from './components/JobsheetLabModal';

const DEFAULT_SETTINGS: GameSettings = {
  bgmVolume: 0.35,
  sfxVolume: 0.6,
  isMuted: false,
  touchControlsVisible: true,
  moveSpeed: 180, // Ms Jobsheet 1
  jumpForce: 480, // Jf Jobsheet 1
  gravityScale: 1.0, // Gravity Scale
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Game UI States
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [highScore, setHighScore] = useState<number>(0);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  // Real-time HUD states
  const [health, setHealth] = useState<number>(100);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    coinsCollected: 0,
    totalCoins: 24,
    highScore: 0,
    levelTimer: 0,
    dronesDefeated: 0,
  });
  const [playerX, setPlayerX] = useState<number>(0);
  const [worldWidth, setWorldWidth] = useState<number>(3800);

  // Load HighScore and Settings from LocalStorage on mount
  useEffect(() => {
    try {
      const savedScore = localStorage.getItem('robot_mini_games_highscore') || localStorage.getItem('chicken_adventure_highscore');
      if (savedScore) {
        const parsed = parseInt(savedScore, 10);
        if (!isNaN(parsed)) {
          setHighScore(parsed);
          setStats((prev) => ({ ...prev, highScore: parsed }));
        }
      }

      const savedSettings = localStorage.getItem('robot_mini_games_settings') || localStorage.getItem('chicken_adventure_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        const merged = { ...DEFAULT_SETTINGS, ...parsedSettings };
        setSettings(merged);
        soundManager.setVolumes(merged.bgmVolume, merged.sfxVolume, merged.isMuted);
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  // Update Settings handler & sync with localStorage and engine
  const handleUpdateSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('robot_mini_games_settings', JSON.stringify(newSettings));
    } catch {
      // Storage save fallback
    }
    soundManager.setVolumes(newSettings.bgmVolume, newSettings.sfxVolume, newSettings.isMuted);
    if (engineRef.current) {
      engineRef.current.updateSettings(newSettings);
    }
  }, []);

  // Initialize Game Engine when canvas is ready
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(
      canvasRef.current,
      settings,
      highScore,
      {
        onGameOver: (finalStats) => {
          setStats({ ...finalStats });
          setHighScore((prev) => Math.max(prev, finalStats.highScore));
          setGameState('GAMEOVER');
        },
        onVictory: (finalStats) => {
          setStats({ ...finalStats });
          setHighScore((prev) => Math.max(prev, finalStats.highScore));
          setGameState('VICTORY');
        },
        onStatsUpdate: (curStats, curHealth) => {
          setStats({ ...curStats });
          setHealth(curHealth);
          if (engineRef.current) {
            setPlayerX(engineRef.current.player.x);
          }
        },
        onPauseToggle: () => {
          setGameState((prev) => {
            if (prev === 'PLAYING') {
              engine.pause();
              return 'PAUSED';
            }
            if (prev === 'PAUSED') {
              engine.resume();
              return 'PLAYING';
            }
            return prev;
          });
        },
      }
    );

    engineRef.current = engine;
    setWorldWidth(engine.level.worldWidth);

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []); // Run once on mount

  // Control action callbacks
  const handlePlay = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.restart();
    setGameState('PLAYING');
  }, []);

  const handleResume = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.resume();
    setGameState('PLAYING');
  }, []);

  const handleRestart = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.restart();
    setGameState('PLAYING');
  }, []);

  const handleMainMenu = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.pause();
    setGameState('MENU');
  }, []);

  const handleTouchInput = useCallback(
    (inputX: number, jumpHolding: boolean, jumpPressed: boolean) => {
      if (engineRef.current) {
        engineRef.current.setTouchInput(inputX, jumpHolding, jumpPressed);
      }
    },
    []
  );

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col justify-center items-center">
      {/* Game Canvas Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block touch-none"
        />

        {/* HUD Overlay - visible during PLAYING and PAUSED */}
        {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
          <GameHUD
            health={health}
            stats={stats}
            playerX={playerX}
            worldWidth={worldWidth}
            onPause={() => {
              if (engineRef.current) {
                engineRef.current.pause();
              }
              setGameState('PAUSED');
            }}
          />
        )}

        {/* On-screen Touch Controls (Mobile D-Pad & Jump) */}
        {gameState === 'PLAYING' && settings.touchControlsVisible && (
          <TouchControls onInput={handleTouchInput} />
        )}

        {/* MODAL / MENU OVERLAYS */}

        {/* 1. Main Menu (Jobsheet 5) */}
        {gameState === 'MENU' && (
          <MainMenu
            highScore={highScore}
            onPlay={handlePlay}
            onOptions={() => setGameState('OPTIONS')}
            onOpenLab={() => setGameState('LAB')}
          />
        )}

        {/* 2. Options Menu (Jobsheet 5 MenuOption) */}
        {gameState === 'OPTIONS' && (
          <OptionsMenu
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onBack={() => setGameState('MENU')}
          />
        )}

        {/* 3. Jobsheet Lab (Eksperimen Fisika Ms, Jf, Gravity) */}
        {gameState === 'LAB' && (
          <JobsheetLabModal
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onApplyAndPlay={handlePlay}
            onClose={() => setGameState('MENU')}
          />
        )}

        {/* 4. Pause Menu */}
        {gameState === 'PAUSED' && (
          <PauseModal
            onResume={handleResume}
            onRestart={handleRestart}
            onOptions={() => setGameState('OPTIONS')}
            onMainMenu={handleMainMenu}
          />
        )}

        {/* 5. Game Over Modal */}
        {gameState === 'GAMEOVER' && (
          <GameOverModal
            stats={stats}
            onRetry={handleRestart}
            onMainMenu={handleMainMenu}
          />
        )}

        {/* 6. Victory Modal */}
        {gameState === 'VICTORY' && (
          <VictoryModal
            stats={stats}
            onPlayAgain={handleRestart}
            onMainMenu={handleMainMenu}
          />
        )}
      </div>
    </main>
  );
}
