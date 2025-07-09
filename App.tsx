import React, { useState, useCallback, useEffect } from 'react';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import SettingsScreen from './components/SettingsScreen';
import StoreScreen from './components/StoreScreen';
import { Difficulty, Quality, RankingEntry, ControlMode } from './types';

export type GameStatus = 'NOT_STARTED' | 'PLAYING' | 'GAME_OVER';

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>('NOT_STARTED');
  const [lastRunStats, setLastRunStats] = useState<RankingEntry | null>(null);
  const [bestRanking, setBestRanking] = useState<RankingEntry | null>(() => {
    try {
      const saved = localStorage.getItem('galactic_annihilator_ranking');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [totalCoins, setTotalCoins] = useState<number>(() => {
    try {
      const savedCoins = localStorage.getItem('galactic_annihilator_coins');
      return savedCoins ? parseInt(savedCoins, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [quality, setQuality] = useState<Quality>('high');
  const [controlMode, setControlMode] = useState<ControlMode>(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return isTouchDevice ? 'touch' : 'keyboard';
  });
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  
  useEffect(() => {
    try {
      localStorage.setItem('galactic_annihilator_coins', totalCoins.toString());
    } catch (error) {
      console.error("Failed to save total coins:", error);
    }
  }, [totalCoins]);

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  const handleStart = useCallback(() => {
    setIsSettingsOpen(false);
    setIsStoreOpen(false);
    setGameStatus('PLAYING');
    setLastRunStats(null);
  }, []);

  const handleGoHome = useCallback(() => {
    setGameStatus('NOT_STARTED');
  }, []);

  const handleGameOver = useCallback((stats: RankingEntry) => {
    setGameStatus('GAME_OVER');
    setLastRunStats(stats);
    setTotalCoins(prevCoins => prevCoins + stats.coinsEarned);

    if (!bestRanking || stats.score > bestRanking.score) {
      setBestRanking(stats);
      try {
        localStorage.setItem('galactic_annihilator_ranking', JSON.stringify(stats));
      } catch (error) {
        console.error("Failed to save ranking:", error);
      }
    }
  }, [bestRanking]);

  const handleOpenSettings = useCallback(() => setIsSettingsOpen(true), []);
  const handleCloseSettings = useCallback(() => setIsSettingsOpen(false), []);
  
  const handleOpenStore = useCallback(() => setIsStoreOpen(true), []);
  const handleCloseStore = useCallback(() => setIsStoreOpen(false), []);

  const renderContent = () => {
    if (isSettingsOpen) {
      return (
        <SettingsScreen
          difficulty={difficulty}
          quality={quality}
          controlMode={controlMode}
          onDifficultyChange={setDifficulty}
          onQualityChange={setQuality}
          onControlModeChange={setControlMode}
          onClose={handleCloseSettings}
        />
      );
    }
    
    if (isStoreOpen) {
      return <StoreScreen totalCoins={totalCoins} onClose={handleCloseStore} />;
    }

    switch (gameStatus) {
      case 'NOT_STARTED':
        return <StartScreen 
            onStart={handleStart} 
            onOpenSettings={handleOpenSettings} 
            onOpenStore={handleOpenStore} 
            bestRanking={bestRanking} 
            lastRunStats={lastRunStats} 
            controlMode={controlMode}
            onToggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen} />;
      case 'PLAYING':
        return (
          <Game
            onGameOver={handleGameOver}
            onRestart={handleStart}
            onGoHome={handleGoHome}
            difficulty={difficulty}
            quality={quality}
            controlMode={controlMode}
          />
        );
      case 'GAME_OVER':
        return <GameOverScreen stats={lastRunStats!} onGoHome={handleGoHome} />;
      default:
        return <StartScreen 
            onStart={handleStart} 
            onOpenSettings={handleOpenSettings} 
            onOpenStore={handleOpenStore} 
            bestRanking={bestRanking} 
            lastRunStats={lastRunStats} 
            controlMode={controlMode}
            onToggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen} />;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black font-sans text-white overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default App;