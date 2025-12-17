import React, { useState, useRef, useEffect } from 'react';
import { GamePhase } from '../types';

interface DialogueBoxProps {
  lastMessage: string;
  onSendMessage: (text: string) => void;
  onLeave: () => void;
  loading: boolean;
  phase: GamePhase;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ lastMessage, onSendMessage, onLeave, loading, phase }) => {
  const [input, setInput] = useState('');
  const isHorror = phase === GamePhase.YANDERE;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 px-4">
      {/* Subtitles Area */}
      <div className={`min-h-[100px] p-6 rounded-xl mb-4 text-center flex items-center justify-center transition-all duration-700 relative overflow-hidden ${isHorror ? 'bg-gray-900 border-2 border-red-800 text-red-500' : 'bg-white/80 backdrop-blur-md border border-blue-100 text-gray-800 shadow-lg'}`}>
        {isHorror && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-20 pointer-events-none"></div>}
        
        <p className={`text-xl md:text-2xl font-bold ${isHorror ? 'font-horror glitch' : 'font-cute'}`} data-text={lastMessage}>
          {loading ? "..." : (lastMessage || "我们聊聊吧！")}
        </p>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isHorror ? "快跑 或 说话..." : "和Sakura说点什么..."}
          disabled={loading}
          className={`flex-1 p-4 rounded-full outline-none transition-all ${
            isHorror 
              ? 'bg-gray-800 text-red-400 border-red-900 placeholder-red-900 focus:border-red-500' 
              : 'bg-white text-gray-700 border-gray-200 focus:ring-2 focus:ring-pink-300'
          } border-2`}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 ${
            isHorror
              ? 'bg-red-900 text-black hover:bg-red-700'
              : 'bg-pink-400 text-white hover:bg-pink-500 shadow-md'
          }`}
        >
          {loading ? '...' : '发送'}
        </button>
      </form>

      {/* Leave Button */}
      <button 
        type="button"
        onClick={onLeave}
        className="w-full py-2 text-sm text-gray-500 hover:text-gray-800 underline transition-colors"
      >
        结束对话，回到教室
      </button>
    </div>
  );
};

export default DialogueBox;