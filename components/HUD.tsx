import React from 'react';
import * as C from '../constants';
import { Player, Quality, SpecialAbilityId, ControlMode } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

interface HUDProps {
  player: Player;
  score: number;
  bossHealth: number | null;
  maxBossHealth: number | null;
  onPauseClick: () => void;
  gameTime: number;
  phase: number;
  onActivateSpecial: (id: SpecialAbilityId) => void;
  quality: Quality;
  controlMode: ControlMode;
}

const StatBar: React.FC<{ value: number; maxValue: number; colorClass: string; label: string }> = ({ value, maxValue, colorClass, label }) => {
  const percentage = maxValue > 0 ? Math.max(0, (value / maxValue) * 100) : 0;
  return (
    <div className='w-full'>
      <span className="text-sm font-bold tracking-widest">{label}</span>
      <div className="w-full bg-gray-700 rounded-full h-3 border-2 border-gray-500 overflow-hidden">
        <div
          className={`${colorClass} h-full rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const XPBar: React.FC<{ level: number, xp: number, xpToNextLevel: number, quality: Quality }> = ({ level, xp, xpToNextLevel, quality }) => {
    const { t } = useTranslation();
    const percentage = xpToNextLevel > 0 ? Math.max(0, (xp / xpToNextLevel) * 100) : 0;
    return (
      <div className='w-full text-center'>
        <div className="text-lg font-bold tracking-widest text-yellow-300 mb-1">{t('level')} {level}</div>
        <div title={`XP: ${xp} / ${xpToNextLevel}`} className="w-full bg-gray-800 rounded-full h-3 border border-gray-600 overflow-hidden relative">
          <div
            className="bg-yellow-400 h-full rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          ></div>
          <div className="absolute inset-0 flex justify-center items-center text-xs font-bold text-white" style={{textShadow: quality !== 'low' ? '1px 1px 1px #000' : 'none'}}>
             {xp} / {xpToNextLevel}
          </div>
        </div>
      </div>
    );
};

const SpecialAbilityButton: React.FC<{
    id: SpecialAbilityId,
    label: string,
    keybind: string,
    player: Player,
    onClick: (id: SpecialAbilityId) => void,
    controlMode: ControlMode,
}> = ({ id, label, keybind, player, onClick, controlMode }) => {
    const now = Date.now();
    const ability = player.specialAbilities[id];
    const cooldownLeft = Math.max(0, ability.lastUsed + ability.cooldown - now);
    const isReady = cooldownLeft === 0 && !player.activeSpecial;
    const isActive = player.activeSpecial?.id === id;

    const cooldownProgress = (cooldownLeft / ability.cooldown) * 100;
    
    let buttonClass = 'bg-gray-800 border-gray-600 text-gray-400';
    if(isActive) {
        buttonClass = 'bg-yellow-500 border-yellow-300 text-black animate-pulse';
    } else if (isReady) {
        buttonClass = 'bg-cyan-800 border-cyan-500 text-white hover:bg-cyan-600';
    }

    return (
        <button
            onClick={() => onClick(id)}
            disabled={!isReady}
            className={`relative w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200 overflow-hidden ${buttonClass}`}
            aria-label={label}
        >
            <div className='font-bold text-lg md:text-xl'>{label}</div>
            {controlMode === 'keyboard' && <div className='font-mono text-xs'>({keybind})</div>}
            {!isReady && !isActive && (
                 <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" style={{ clipPath: `inset(${cooldownProgress}% 0 0 0)` }}></div>
            )}
        </button>
    );
}

const ResourceDisplay: React.FC<{ icon: React.ReactNode, value: number | string, 'aria-label': string }> = ({ icon, value, 'aria-label': ariaLabel }) => {
    return (
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md border border-gray-600" aria-label={ariaLabel}>
            <div className="w-5 h-5">{icon}</div>
            <span className="font-mono text-lg font-bold">{value}</span>
        </div>
    );
};

export const HUD: React.FC<HUDProps> = ({ player, score, bossHealth, maxBossHealth, onPauseClick, gameTime, phase, onActivateSpecial, quality, controlMode }) => {
  const { t } = useTranslation();
  const totalSeconds = Math.floor(gameTime / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  const timeString = `${minutes}:${seconds}`;

  const isTouch = controlMode === 'touch';
  const showSkillsPanel = window.innerWidth >= 768; // md breakpoint

  return (
    <>
      <div className="absolute top-0 left-0 right-0 p-2 md:p-4 text-white flex justify-between items-start bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className={`w-1/3 pointer-events-auto flex flex-col gap-2 ${showSkillsPanel ? 'pl-64' : ''}`}>
            <StatBar value={player.shield} maxValue={player.maxShield} colorClass="bg-cyan-400" label={t('shield')} />
            <StatBar value={player.hull} maxValue={player.maxHull} colorClass="bg-red-500" label={t('hull')} />
        </div>
        <div className="text-center flex flex-col items-center gap-1">
            <div className="text-3xl md:text-4xl font-bold text-yellow-300 tracking-wider" style={{ textShadow: quality !== 'low' ? '0 0 10px #facc15' : 'none' }}>{score.toString().padStart(6, '0')}</div>
            <div className="flex justify-center items-baseline gap-2">
                <div className="text-lg md:text-xl font-mono text-cyan-300" style={{ textShadow: quality !== 'low' ? '0 0 5px #22d3ee' : 'none' }}>{timeString}</div>
                <div className="text-base md:text-lg font-bold text-purple-300" style={{ textShadow: quality !== 'low' ? '0 0 5px #c084fc' : 'none' }}>{t('phase')}: {phase}</div>
            </div>
             <div className="flex gap-2 md:gap-4 mt-1 text-yellow-200 pointer-events-auto">
                <ResourceDisplay
                    aria-label={`${player.coins} ${t('coins')}`}
                    icon={<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2zm0 6h2v2h-2z" fill="#facc15"/></svg>}
                    value={player.coins}
                />
                <ResourceDisplay
                    aria-label={`${player.revivalKeys} ${t('revival_keys')}`}
                    icon={<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.78 6.57C19.95 5.56 18.53 5 17 5c-1.63 0-3.11.64-4.18 1.71L12 7.55V3h-2v6h6V7H9.7l1.59-1.59C12.18 4.52 14.47 4 17 4c2.21 0 4.21 1.05 5.5 2.72l-1.72 1.85zM3.49 18.28l1.72-1.85C6.05 17.44 7.47 18 9 18c1.63 0 3.11-.64 4.18-1.71L14.3 15.45V20h2v-6H10v2h4.3l-1.59 1.59C11.82 18.48 9.53 19 7 19c-2.21 0-4.21-1.05-5.5-2.72z" fill="#67e8f9"/></svg>}
                    value={player.revivalKeys}
                />
            </div>
        </div>
        <div className='w-1/3 flex justify-end items-start pointer-events-auto'>
            <button
                onClick={onPauseClick}
                className="w-12 h-12 bg-black/30 border-2 border-cyan-400 rounded-md flex items-center justify-center
                           hover:bg-cyan-500 hover:border-cyan-200 transition-all duration-300 group"
                aria-label={t('pause_game')}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19M16 5V19" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" 
                        className="text-cyan-400 group-hover:text-black transition-colors" />
                </svg>
            </button>
        </div>
      </div>
      {bossHealth !== null && maxBossHealth !== null && (
        <div className="absolute top-28 md:top-32 left-1/2 -translate-x-1/2 w-2/3 md:w-1/2 p-2">
           <StatBar value={bossHealth} maxValue={maxBossHealth} colorClass="bg-red-500" label={t('boss_hull')} />
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3 md:w-1/3 pointer-events-none">
           <XPBar level={player.level} xp={player.xp} xpToNextLevel={player.xpToNextLevel} quality={quality} />
      </div>

      {controlMode === 'keyboard' ? (
        <div className="absolute bottom-4 right-4 flex gap-2 md:gap-3 pointer-events-auto">
          <SpecialAbilityButton id="bomb" label="BOM" keybind="1" player={player} onClick={onActivateSpecial} controlMode={controlMode} />
          <SpecialAbilityButton id="powerShot" label="RAJ" keybind="2" player={player} onClick={onActivateSpecial} controlMode={controlMode} />
          <SpecialAbilityButton id="helper" label="AJU" keybind="3" player={player} onClick={onActivateSpecial} controlMode={controlMode} />
          <SpecialAbilityButton id="superShield" label="ESC" keybind="4" player={player} onClick={onActivateSpecial} controlMode={controlMode} />
        </div>
      ) : (
        <>
          {/* Left Side Buttons */}
          <div className={`absolute left-4 flex flex-col gap-2 pointer-events-auto md:left-10 md:gap-3 ${isTouch ? 'bottom-32 md:bottom-44' : ''}`}>
            <SpecialAbilityButton id="bomb" label="BOM" keybind="1" player={player} onClick={onActivateSpecial} controlMode={controlMode} />
            <SpecialAbilityButton id="powerShot" label="RAJ" keybind="2" player={player} onClick={onActivateSpecial} controlMode={controlMode} />
          </div>
          {/* Right Side Buttons */}
          <div className={`absolute right-4 flex flex-col gap-2 pointer-events-auto md:right-10 md:gap-3 ${isTouch ? 'bottom-32 md:bottom-44' : ''}`}>
            <SpecialAbilityButton id="helper" label="AJU" keybind="3" player={player} onClick={onActivateSpecial} controlMode={controlMode} />
            <SpecialAbilityButton id="superShield" label="ESC" keybind="4" player={player} onClick={onActivateSpecial} controlMode={controlMode} />
          </div>
        </>
      )}
    </>
  );
};