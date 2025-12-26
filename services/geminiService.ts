
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, MealPlan } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  /**
   * Generates a high-quality professional food image using Imagen 4.
   */
  async generateRecipeImage(recipeName: string, description: string): Promise<string> {
    try {
      const imageAi = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const response = await imageAi.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Editorial food photography of a high-alkaline vegan dish: ${recipeName}. ${description}. Minimalist, aesthetic, fresh ingredients, soft morning light, focus on cellular vitality and natural textures. 8k, professional lighting, hyper-realistic. No humans.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64 = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64}`;
      }
      throw new Error("No images returned from Imagen");
    } catch (error) {
      console.error("Imagen generation failed, falling back to placeholder:", error);
      return `https://picsum.photos/seed/${encodeURIComponent(recipeName)}/800/600`;
    }
  }

  async generateAlkalineRecipe(goal: string, preferences: string): Promise<Recipe> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Master Alchemist of Cellular Longevity. Your task is to generate a 100% alkaline vegan recipe that facilitates biological rejuvenation and cellular repair.

Goal: ${goal}
User context/preferences: ${preferences}

Requirements:
1. VARIETY: Use alkaline grains, sea vegetables, medicinal mushrooms, and exotic high-pH fruits.
2. CREATIVITY: Evocative names (e.g., DNA Repair, Telomere Support).
3. CHEMISTRY: Strictly alkaline ingredients.
4. SCALE: Alkalinity level 1-10.

Strictly follow the provided JSON schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            prepTime: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['Healing', 'Weight Loss', 'Anti-Cancer', 'General Vitality'] },
            alkalinityLevel: { type: Type.NUMBER }
          },
          required: ["name", "description", "ingredients", "instructions", "prepTime", "category", "alkalinityLevel"]
        }
      }
    });

    try {
      const recipeData = JSON.parse(response.text || '{}');
      const imageUrl = await this.generateRecipeImage(recipeData.name, recipeData.description);
      return {
        ...recipeData,
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: imageUrl
      };
    } catch (e) {
      console.error("Recipe generation failed", e);
      return {
        id: 'fallback-' + Date.now(),
        name: 'Vitality Essence Bowl',
        description: 'A balanced alkaline blend for immediate cellular support.',
        ingredients: ['Kale', 'Cucumber', 'Avocado', 'Lemon'],
        instructions: ['Combine all ingredients in a bowl.', 'Dress with lemon juice.'],
        prepTime: '10 mins',
        category: 'General Vitality',
        alkalinityLevel: 8,
        imageUrl: 'https://picsum.photos/seed/vitality/800/600'
      };
    }
  }

  async generateMealPlan(goal: string, preferences: string): Promise<MealPlan> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Design a 7-day personalized Alkaline Vegan Meal Plan.
Goal: ${goal}
Preferences: ${preferences}

Ensure every day has a breakfast, lunch, dinner, and snack. All meals must be strictly alkaline-forming.
Theme the plan around biological immortality and cellular reset.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Inspiring protocol title" },
            goal: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  breakfast: { type: Type.STRING },
                  lunch: { type: Type.STRING },
                  dinner: { type: Type.STRING },
                  snack: { type: Type.STRING }
                },
                required: ["day", "breakfast", "lunch", "dinner", "snack"]
              }
            }
          },
          required: ["title", "goal", "days"]
        }
      }
    });

    try {
      const planData = JSON.parse(response.text || '{}');
      return {
        ...planData,
        id: Math.random().toString(36).substr(2, 9),
        createdDate: new Date().toLocaleDateString()
      };
    } catch (e) {
      throw new Error("Failed to synthesize meal plan protocol.");
    }
  }

  async getAlkalineInsight(query: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Act as a high-level biological advisor. Explain the alkaline vegan perspective on: "${query}". Keep it visionary and encouraging.`,
    });
    return response.text || "The matrix is recalibrating.";
  }
}

export const geminiService = new GeminiService();
