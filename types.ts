export enum GamePhase {
  NORMAL = 'NORMAL',
  YANDERE = 'YANDERE',
  REDEEMED = 'REDEEMED',
  BAD_END = 'BAD_END'
}

export enum GameMode {
  MAP = 'MAP',
  CHAT = 'CHAT'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface GameState {
  day: number;
  affection: number; // 0-100
  phase: GamePhase;
  mode: GameMode;
  history: Message[];
  lastInput: string;
}

export interface CharacterResponse {
  text: string;
  emotion: string; // e.g., "happy", "blush", "angry", "creepy"
  affectionChange: number;
  eventTriggered?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }
}