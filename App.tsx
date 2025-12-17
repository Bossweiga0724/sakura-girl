import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GamePhase, GameMode, Message, Achievement } from './types';
import { INITIAL_AFFECTION, ACHIEVEMENTS_LIST, MAX_DAYS } from './constants';
import { generateCharacterReply, generateCharacterImage } from './services/geminiService';
import CharacterDisplay from './components/CharacterDisplay';
import DialogueBox from './components/DialogueBox';
import HUD from './components/HUD';
import GameMap from './components/GameMap';

const App: React.FC = () => {
  // Game State
  const [day, setDay] = useState(1);
  const [affection, setAffection] = useState(INITIAL_AFFECTION);
  const [phase, setPhase] = useState<GamePhase>(GamePhase.NORMAL);
  const [mode, setMode] = useState<GameMode>(GameMode.MAP);
  const [history, setHistory] = useState<Message[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS_LIST);
  
  // UI State
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string>("你好！你是新来的吗？");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Image Cache: Maps "Phase-Emotion" to Base64/URL string
  const [imageCache, setImageCache] = useState<Record<string, string>>({});

  // Check for API Key on mount
  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  // Initialize Game once Key is confirmed
  useEffect(() => {
    if (!hasApiKey) return;

    const init = async () => {
      setLoading(true);
      // Pre-load default state
      await getCachedImage(GamePhase.NORMAL, "happy");
      setInitializing(false);
      setLoading(false);
      unlockAchievement('first_meet');
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasApiKey]);

  // Helper to get image from cache or generate it
  const getCachedImage = async (phase: GamePhase, emotion: string): Promise<string | null> => {
    const key = `${phase}-${emotion}`;
    if (imageCache[key]) {
      setCurrentImage(imageCache[key]);
      return imageCache[key];
    }
    
    // Generate new if not in cache
    const newImage = await generateCharacterImage(phase, emotion);
    if (newImage) {
      setImageCache(prev => ({ ...prev, [key]: newImage }));
      setCurrentImage(newImage);
    }
    return newImage;
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setHasApiKey(true);
      } catch (e) {
        console.error("Failed to select key", e);
      }
    }
  };

  // Check Phase Logic
  useEffect(() => {
    if (day >= MAX_DAYS && phase === GamePhase.NORMAL) {
      triggerShift();
    }
  }, [day, phase]);

  const triggerShift = async () => {
    setPhase(GamePhase.YANDERE);
    setLastMessage("...你为什么要那样看着我？你想离开，对吧？");
    setAffection(100); // Obsessed
    unlockAchievement('shift');
    setLoading(true);
    await getCachedImage(GamePhase.YANDERE, "staring");
    setLoading(false);
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(a => 
      a.id === id ? { ...a, unlocked: true } : a
    ));
  };

  const handleSendMessage = async (text: string) => {
    setLoading(true);
    
    // Add user message to history
    const newHistory = [...history, { role: 'user', text } as Message].slice(-10); // Keep last 10 turns
    setHistory(newHistory);

    // Call API
    const response = await generateCharacterReply(text, phase, newHistory);
    
    // Update State
    setLastMessage(response.text);
    setAffection(prev => {
      const newVal = prev + response.affectionChange;
      if (newVal >= 70 && phase === GamePhase.NORMAL) unlockAchievement('best_friend');
      return newVal;
    });

    // Handle Redemption/Bad End Logic during Yandere phase
    if (phase === GamePhase.YANDERE) {
       if (response.affectionChange > 5) {
          if (affection > 120) { 
             setPhase(GamePhase.REDEEMED);
             setLastMessage("我... 对不起。我不知道我怎么了。谢谢你留下来。");
             unlockAchievement('redeemer');
             await getCachedImage(GamePhase.REDEEMED, "crying_happy");
             setLoading(false);
             return;
          }
       }
    }

    // Switch visual state based on response emotion
    await getCachedImage(phase, response.emotion);
    
    // Update history with bot response
    setHistory([...newHistory, { role: 'model', text: response.text }]);
    
    setLoading(false);
  };

  const handleNextDay = () => {
    setDay(prev => prev + 1);
    setLastMessage("又过了一天...");
  };

  // 1. API Key Selection Screen
  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h1 className="text-4xl font-horror text-red-500 mb-8 text-center">Yandere Shift</h1>
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-gray-700">
          <p className="mb-6 text-gray-300">
            本游戏使用高质量生成模型。
            请选择一个付费 API 密钥以继续。
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            开始游戏
          </button>
          <div className="mt-4 text-sm text-gray-500">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-red-400 underline"
            >
              计费说明
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. Loading Screen
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-xl font-cute animate-bounce text-blue-400">正在加载游戏资源...</div>
      </div>
    );
  }

  // 3. Main Game
  return (
    <div className={`min-h-screen w-full transition-colors duration-1000 flex flex-col items-center relative overflow-hidden ${phase === GamePhase.YANDERE ? 'bg-gray-950' : 'bg-gradient-to-b from-blue-50 to-pink-50'}`}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
          {phase === GamePhase.NORMAL ? (
             <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/0 to-blue-100/50"></div>
          ) : (
             <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 to-black"></div>
          )}
      </div>

      <HUD 
        day={day} 
        affection={affection} 
        phase={phase}
        onNextDay={handleNextDay}
        achievements={achievements}
      />

      <div className="flex-1 w-full max-w-4xl z-10 flex flex-col justify-center py-10 px-4">
        
        {mode === GameMode.MAP ? (
          <GameMap 
            onInteract={() => setMode(GameMode.CHAT)} 
            phase={phase} 
          />
        ) : (
          <>
            <CharacterDisplay 
              imageUrl={currentImage} 
              loading={loading && !currentImage}
              phase={phase}
            />
            
            <DialogueBox 
              lastMessage={lastMessage} 
              onSendMessage={handleSendMessage}
              onLeave={() => setMode(GameMode.MAP)}
              loading={loading}
              phase={phase}
            />
          </>
        )}
        
      </div>

    </div>
  );
};

export default App;