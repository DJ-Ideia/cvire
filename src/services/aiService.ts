import { GoogleGenAI } from '@google/genai';
import { getDecryptedAPIKey } from '../db/cryptoVault';

export async function enhanceBulletPointWithAI(originalText: string, jobTitle: string): Promise<string> {
  const apiKey = await getDecryptedAPIKey('gemini');
  if (!apiKey) {
    throw new Error('No Gemini API Key found. Please configure your key in Settings.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert resume writer and ATS specialist. 
Rewrite the following resume bullet point to make it compelling, action-driven (using strong action verbs like Spearheaded, Developed, Optimized), and structured around quantifiable impact for a ${jobTitle} role.

Original Bullet: "${originalText}"

Return ONLY the single improved bullet point string without quotes or conversational filler.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text ? response.text.trim() : originalText;
}
