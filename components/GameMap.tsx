import React, { useState, useEffect } from 'react';
import { GamePhase } from '../types';

interface GameMapProps {
  onInteract: () => void;
  phase: GamePhase;
}

const GameMap: React.FC<GameMapProps> = ({ onInteract, phase }) => {
  const isHorror = phase === GamePhase.YANDERE;
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const [statusText, setStatusText] = useState("发呆中...");

  // Random movement logic
  useEffect(() => {
    const moveInterval = setInterval(() => {
      const newX = Math.random() * 80 + 10; // 10% to 90%
      const newY = Math.random() * 80 + 10;
      setTarget({ x: newX, y: newY });
      
      const actions = isHorror 
        ? ["盯着你...", "磨刀...", "在那边...", "嘿嘿嘿...", "别想跑"]
        : ["哼着歌...", "看窗外", "整理书包", "发呆中...", "想心事"];
      
      setStatusText(actions[Math.floor(Math.random() * actions.length)]);

    }, 4000);

    return () => clearInterval(moveInterval);
  }, [isHorror]);

  // Smooth position interpolation
  useEffect(() => {
    const animInterval = setInterval(() => {
      setPosition(prev => ({
        x: prev.x + (target.x - prev.x) * 0.05,
        y: prev.y + (target.y - prev.y) * 0.05
      }));
    }, 50);
    return () => clearInterval(animInterval);
  }, [target]);

  return (
    <div className={`relative w-full max-w-4xl h-[500px] rounded-xl overflow-hidden shadow-2xl transition-all duration-1000 border-4 ${isHorror ? 'bg-gray-900 border-red-900' : 'bg-[#fff5e6] border-amber-200'}`}>
      
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className={`w-full h-full ${isHorror ? 'bg-[radial-gradient(circle,red,transparent)]' : 'bg-[radial-gradient(circle,pink,transparent)]'}`} style={{backgroundSize: '20px 20px'}}></div>
      </div>
      
      {/* Furniture (Abstract) */}
      <div className="absolute top-10 left-10 w-32 h-20 bg-amber-800/30 rounded border border-amber-800/50 flex items-center justify-center text-xs text-amber-900">讲台</div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-amber-800/20 rounded border border-amber-800/40 flex items-center justify-center text-xs text-amber-900">课桌区</div>

      {/* Title */}
      <div className="absolute top-4 left-0 w-full text-center font-bold opacity-50 pointer-events-none">
        {isHorror ? '??? 教室' : '二年级 B 班'}
      </div>

      {/* Chibi Character */}
      <div 
        onClick={onInteract}
        className="absolute w-16 h-24 cursor-pointer hover:scale-110 transition-transform z-20 flex flex-col items-center"
        style={{ left: `${position.x}%`, top: `${position.y}%`, transform: 'translate(-50%, -50%)' }}
      >
        {/* Status Bubble */}
        <div className={`whitespace-nowrap mb-2 px-2 py-1 rounded-lg text-xs font-bold animate-bounce ${isHorror ? 'bg-black text-red-500 border border-red-500' : 'bg-white text-gray-600 shadow border border-gray-100'}`}>
          {statusText}
        </div>

        {/* Avatar Body */}
        <div className={`w-12 h-12 rounded-full shadow-lg relative ${isHorror ? 'bg-gray-800 ring-2 ring-red-500' : 'bg-pink-100 ring-2 ring-pink-300'}`}>
          {/* Eyes */}
          <div className="absolute top-4 left-3 w-1.5 h-1.5 bg-black rounded-full"></div>
          <div className="absolute top-4 right-3 w-1.5 h-1.5 bg-black rounded-full"></div>
          {/* Blush / Shadow */}
          <div className={`absolute top-6 left-2 w-8 h-2 rounded-full opacity-50 ${isHorror ? 'bg-red-800' : 'bg-pink-300'}`}></div>
        </div>
        
        {/* Body */}
        <div className={`w-8 h-10 -mt-1 rounded-b-lg ${isHorror ? 'bg-red-950' : 'bg-blue-600'}`}></div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-0 w-full text-center text-sm opacity-60 pointer-events-none">
        点击小人开始对话
      </div>

    </div>
  );
};

export default GameMap;