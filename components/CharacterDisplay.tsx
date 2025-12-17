import React, { useState, useEffect } from 'react';
import { GamePhase } from '../types';

interface CharacterDisplayProps {
  imageUrl: string | null;
  loading: boolean;
  phase: GamePhase;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ imageUrl, loading, phase }) => {
  const isHorror = phase === GamePhase.YANDERE;
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset loaded state when url changes
  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl]);

  const showLoading = loading || (imageUrl && !imageLoaded);

  return (
    <div className={`relative w-full max-w-md aspect-square mx-auto rounded-lg overflow-hidden border-4 transition-colors duration-1000 ${isHorror ? 'border-red-900 shadow-[0_0_30px_rgba(255,0,0,0.6)]' : 'border-white shadow-xl'}`}>
      
      {/* Background Atmosphere */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${isHorror ? 'bg-black' : 'bg-blue-50'}`}></div>

      {/* Image */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Sakura" 
          onLoad={() => setImageLoaded(true)}
          className={`relative w-full h-full object-cover transition-opacity duration-500 ${showLoading ? 'opacity-0' : 'opacity-100'} ${isHorror ? 'animate-pulse' : ''}`}
        />
      )}
      
      {!imageUrl && !loading && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
           No Signal
        </div>
      )}

      {/* Horror Overlay Effects */}
      {isHorror && (
        <>
          <div className="absolute inset-0 bg-red-900 mix-blend-overlay opacity-30 pointer-events-none animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 opacity-50 animate-[ping_3s_infinite]"></div>
        </>
      )}

      {/* Loading Overlay */}
      {showLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 z-10 backdrop-blur-sm transition-opacity duration-300">
          <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-2 ${isHorror ? 'border-red-600' : 'border-blue-400'}`}></div>
          <span className={`text-xs font-bold ${isHorror ? 'text-red-500' : 'text-white'}`}>
            {isHorror ? '正在显影...' : '正在绘制...'}
          </span>
        </div>
      )}
    </div>
  );
};

export default CharacterDisplay;