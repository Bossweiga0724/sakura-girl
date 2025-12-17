import { GoogleGenAI, Type } from "@google/genai";
import { GamePhase, CharacterResponse, Message } from '../types';
import { SYSTEM_INSTRUCTION_NORMAL, SYSTEM_INSTRUCTION_YANDERE, IMAGE_PROMPT_TEMPLATE } from '../constants';

export const generateCharacterReply = async (
  input: string,
  phase: GamePhase,
  history: Message[]
): Promise<CharacterResponse> => {
  // Initialize inside function to get the latest API_KEY from process.env after user selection
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const isYandere = phase === GamePhase.YANDERE;
  const systemInstruction = isYandere ? SYSTEM_INSTRUCTION_YANDERE : SYSTEM_INSTRUCTION_NORMAL;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: input }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            emotion: { type: Type.STRING },
            affectionChange: { type: Type.INTEGER },
          },
          required: ["text", "emotion", "affectionChange"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as CharacterResponse;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return {
      text: "...",
      emotion: isYandere ? "staring" : "neutral",
      affectionChange: 0
    };
  }
};

export const generateCharacterImage = async (phase: GamePhase, emotion: string): Promise<string | null> => {
  // Switch to Pollinations.ai for free, reliable image generation
  // Using 'flux' model which is excellent for anime styles
  try {
    const prompt = IMAGE_PROMPT_TEMPLATE(phase, emotion);
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Add a random seed to create variations, or keep it static per emotion if desired.
    // Here we use a random seed to make it feel alive, but you could hash the emotion string to make it consistent.
    const seed = Math.floor(Math.random() * 100000);
    
    // Construct the URL
    // nologo=true hides the AI watermark
    const url = `https://pollinations.ai/p/${encodedPrompt}?width=512&height=512&seed=${seed}&model=flux&nologo=true`;
    
    return url;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};