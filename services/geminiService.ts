
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateAlkalineRecipe(goal: string, preferences: string): Promise<Recipe> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a delicious, 100% alkaline vegan recipe for the goal: ${goal}. 
      User preferences/ingredients: ${preferences}. 
      Focus on healing, anti-inflammatory, and high-pH ingredients. 
      The recipe should reflect the 'Biological Immortality' theme of cellular rejuvenation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            prepTime: { type: Type.STRING },
            category: { type: Type.STRING },
            alkalinityLevel: { type: Type.NUMBER }
          },
          required: ["name", "description", "ingredients", "instructions", "prepTime", "category", "alkalinityLevel"]
        }
      }
    });

    const recipeData = JSON.parse(response.text || '{}');
    return {
      ...recipeData,
      id: Math.random().toString(36).substr(2, 9),
      imageUrl: `https://picsum.photos/seed/${recipeData.name?.replace(/\s/g, '') || 'recipe'}/800/600`
    };
  }

  async getAlkalineInsight(query: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the alkaline vegan perspective on: "${query}". 
      Focus on biological immortality, cellular healing, and disease prevention (combatting cancer, inflammation). 
      Keep it encouraging, scientific-sounding yet accessible, and focused on alkaline principles.`,
      config: {
        temperature: 0.7,
        topP: 0.95
      }
    });
    return response.text || "I'm sorry, I couldn't generate an insight at this moment.";
  }
}

export const geminiService = new GeminiService();
