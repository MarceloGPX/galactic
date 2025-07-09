import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface StoreScreenProps {
  totalCoins: number;
  onClose: () => void;
}

const StoreScreen: React.FC<StoreScreenProps> = ({ totalCoins, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-black/70 rounded-lg shadow-2xl shadow-yellow-500/20 border-2 border-yellow-400 w-full max-w-lg backdrop-blur-sm">
      <h1 className="text-5xl font-bold text-yellow-300 mb-6 tracking-widest" style={{ textShadow: '0 0 15px #facc15' }}>
        {t('store')}
      </h1>
      
      <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-lg border border-gray-600 mb-8">
          <span className="text-2xl text-gray-300">{t('your_coins')}:</span>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-yellow-400"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z" fill="#facc15"/></svg>
            <span className="font-mono text-3xl font-bold text-yellow-300">{totalCoins}</span>
          </div>
      </div>
      
      <p className="text-xl text-gray-400 mb-10">{t('store_coming_soon')}</p>

      <button
        onClick={onClose}
        className="px-10 py-3 bg-cyan-500 text-black font-bold text-2xl rounded-md border-2 border-cyan-300
                   hover:bg-yellow-300 hover:scale-105 transition-all duration-300
                   shadow-[0_0_20px_rgba(34,211,238,0.7)]"
      >
        {t('back')}
      </button>
    </div>
  );
};

export default StoreScreen;
