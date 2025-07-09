
import React from 'react';
import { Collectible, Quality } from '../../types';
import * as C from '../../constants';

interface CollectibleVisualProps {
  collectible: Collectible;
  quality: Quality;
}

const RevivalKey: React.FC<{ quality: Quality }> = ({ quality }) => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 24 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            {quality === 'high' && (
                <defs>
                    <filter id="key-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            )}
            <g style={{ filter: quality === 'high' ? 'url(#key-glow)' : 'none' }}>
                <path d="M12 11C15.866 11 19 7.86599 19 4C19 0.134007 15.866 -3 12 -3C8.13401 -3 5 0.134007 5 4C5 7.86599 8.13401 11 12 11Z" transform="translate(0 5)" fill="#FBBF24"/>
                <path d="M11 14H13V24H11V14Z" fill="#FBBF24"/>
                <path d="M11 26H13V28H17V30H13V34H11V30H7V28H11V26Z" fill="#FBBF24"/>
            </g>
        </svg>
    )
}

export const CollectibleVisual: React.FC<CollectibleVisualProps> = ({ collectible, quality }) => {
    
    const renderCollectible = () => {
        switch(collectible.type) {
            case 'revivalKey':
                return <RevivalKey quality={quality} />;
            default:
                return null;
        }
    }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${(collectible.position.x / C.GAME_WIDTH) * 100}%`,
        top: `${(collectible.position.y / C.GAME_HEIGHT) * 100}%`,
        width: `${(collectible.size.width / C.GAME_WIDTH) * 100}%`,
        height: `${(collectible.size.height / C.GAME_HEIGHT) * 100}%`,
      }}
      className={quality !== 'low' ? 'animate-pulse' : ''}
    >
      {renderCollectible()}
    </div>
  );
};