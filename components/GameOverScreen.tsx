import React from 'react';
import { RankingEntry } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface GameOverScreenProps {
  stats: RankingEntry;
  onGoHome: () => void;
}

const StatDisplay: React.FC<{ label: string; value: string | number; valueColor: string; shadowColor: string; }> = ({ label, value, valueColor, shadowColor }) => (
    <div className="text-center">
        <p className="text-xl md:text-2xl text-gray-300 mb-2">{label}</p>
        <p className={`text-5xl md:text-6xl font-bold ${valueColor}`} style={{textShadow: `0 0 15px ${shadowColor}`}}>{value}</p>
    </div>
);

const GameOverScreen: React.FC<GameOverScreenProps> = ({ stats, onGoHome }) => {
  const { t } = useTranslation();
  const time = new Date(0);
  time.setMilliseconds(stats.gameTime);
  const timeString = `${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 md:p-8 bg-black/50 rounded-lg shadow-2xl shadow-red-500/20 border-2 border-red-500 w-full max-w-4xl">
      <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-red-500 mb-4" style={{textShadow: '0 0 15px #ef4444'}}>{t('game_over')}</h1>
      
      <div className="grid grid-cols-2 gap-y-8 gap-x-4 my-8 w-full max-w-3xl">
        <StatDisplay 
            label={t('final_score')}
            value={stats.score}
            valueColor="text-yellow-300"
            shadowColor="#facc15"
        />
        <StatDisplay 
            label={t('phase_reached')}
            value={stats.phase}
            valueColor="text-purple-300"
            shadowColor="#c084fc"
        />
        <StatDisplay 
            label={t('survival_time')}
            value={timeString}
            valueColor="text-cyan-300"
            shadowColor="#22d3ee"
        />
        <StatDisplay 
            label={t('coins_earned')}
            value={stats.coinsEarned}
            valueColor="text-yellow-400"
            shadowColor="#facc15"
        />
      </div>
      
      <button
        onClick={onGoHome}
        className="px-10 py-4 bg-cyan-500 text-black font-bold text-2xl rounded-md border-2 border-cyan-300
                   hover:bg-yellow-300 hover:text-black hover:scale-110 transition-all duration-300
                   shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:shadow-[0_0_30px_rgba(250,204,21,0.8)]"
      >
        {t('back_to_menu')}
      </button>
    </div>
  );
};

export default GameOverScreen;