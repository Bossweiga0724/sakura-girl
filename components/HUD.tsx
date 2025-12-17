import React from 'react';
import { GamePhase, Achievement } from '../types';

interface HUDProps {
  day: number;
  affection: number;
  phase: GamePhase;
  onNextDay: () => void;
  achievements: Achievement[];
}

const HUD: React.FC<HUDProps> = ({ day, affection, phase, onNextDay, achievements }) => {
  const isHorror = phase === GamePhase.YANDERE;

  return (
    <div className={`fixed top-0 left-0 w-full p-4 flex justify-between items-start z-50 pointer-events-none ${isHorror ? 'text-red-600' : 'text-gray-700'}`}>
      
      {/* Stats Panel */}
      <div className="bg-white/90 backdrop-blur pointer-events-auto p-4 rounded-xl shadow-lg border border-gray-200 max-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-lg">第 {day} / 50 天</span>
        </div>
        
        {/* Affection Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span>好感度</span>
            <span>{affection}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${isHorror ? 'bg-red-800' : 'bg-pink-400'}`}
              style={{ width: `${Math.min(100, Math.max(0, affection))}%` }}
            ></div>
          </div>
        </div>

        {/* Music Indicator */}
        <div className="flex items-center gap-2 text-xs opacity-70 mt-4">
           <span className={`${isHorror ? 'animate-pulse' : ''}`}>🎵</span>
           <span>{isHorror ? 'BGM: 破碎的灵魂' : 'BGM: 校园日常'}</span>
        </div>
      </div>

      {/* Controls & Achievements */}
      <div className="flex flex-col gap-2 pointer-events-auto items-end">
        <button 
          onClick={onNextDay}
          className={`px-4 py-2 rounded-lg font-bold shadow-lg transition-all ${
            isHorror 
              ? 'bg-gray-900 border border-red-600 text-red-600 hover:bg-black' 
              : 'bg-blue-400 text-white hover:bg-blue-500'
          }`}
        >
          跳到下一天 ⏩
        </button>

        {/* Achievements List */}
        <div className="mt-4 flex flex-col gap-1 items-end">
            {achievements.filter(a => a.unlocked).map(a => (
                <div key={a.id} className={`text-xs px-2 py-1 rounded border animate-[fadeIn_0.5s_ease-out] ${isHorror ? 'bg-black border-red-900 text-red-500' : 'bg-yellow-100 border-yellow-300 text-yellow-800'}`}>
                    🏆 {a.name}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HUD;