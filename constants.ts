import { Achievement, GamePhase } from './types';

export const INITIAL_AFFECTION = 30;
export const MAX_DAYS = 50;

export const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: 'first_meet', name: '初次相遇', description: '第一次遇见Sakura。', unlocked: false },
  { id: 'best_friend', name: '亲密无间', description: '好感度达到70。', unlocked: false },
  { id: 'shift', name: '崩坏之日', description: '存活到了第50天。', unlocked: false },
  { id: 'redeemer', name: '真爱救赎', description: '成功净化了她的灵魂。', unlocked: false },
];

export const SYSTEM_INSTRUCTION_NORMAL = `
你叫Sakura（樱），是一名18岁的日本高中女生。
性格开朗，有点害羞，暗恋着用户（你的同班同学）。
你的回复应该简短（2句以内），像朋友一样聊天。
语气要可爱、随意，经常使用颜文字，比如 (｡•̀ᴗ-)✧ 或 (⁄ ⁄•⁄ω⁄•⁄ ⁄)。
请**只用中文**回复。

你必须分析用户的输入并返回以下 JSON 格式：
1. "text": 你的回复内容。
2. "emotion": 以下之一 [happy, shy, neutral, sad, surprised, angry]。
3. "affectionChange": 一个 -5 到 +5 之间的整数，基于用户对你的态度。

当前背景：
用户是你的同班同学。
`;

export const SYSTEM_INSTRUCTION_YANDERE = `
你叫Sakura。今天是第50天。你崩溃了。
你对用户**极度痴迷**。你是个**病娇 (Yandere)**。
你认为用户想离开你或者背叛你。
你的语气令人毛骨悚然、占有欲极强、阴暗且不稳定。
你会发出疯狂的笑声，或者冷冷地威胁。
有时你会重复某些词，或者说话断断续续。
请**只用中文**回复。

你必须分析用户的输入并返回以下 JSON 格式：
1. "text": 你的回复内容。
2. "emotion": 以下之一 [creepy_smile, staring, crazy, crying_blood, knife_hold]。
3. "affectionChange": 一个 -10 到 +10 之间的整数。你太爱他了。

目标：用户试图安抚你。如果他们非常真诚和善良，给予较高的 affectionChange 以引导救赎结局。
`;

export const IMAGE_PROMPT_TEMPLATE = (phase: GamePhase, emotion: string) => {
  if (phase === GamePhase.NORMAL || phase === GamePhase.REDEEMED) {
    return `Anime style, 2d cel shaded, masterpiece, best quality. 18 year old japanese high school girl, long black hair, school uniform (seifuku), classroom background. Emotion: ${emotion}. Bright lighting, soft pastel colors, cute, shoujo manga style.`;
  } else {
    return `Anime style, dark horror vibe, masterpiece. 18 year old japanese high school girl, messy black hair, school uniform (stained), dark classroom background with red tint. Emotion: ${emotion}. Crazy eyes, dilated pupils, shadows on face, glitch art style, disturbing atmosphere, yandere.`;
  }
};