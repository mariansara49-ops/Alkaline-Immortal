
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

  async generateMealPlan(goal: string, preferences: string, availableRecipes: Recipe[]): Promise<MealPlan> {
    const recipeNames = availableRecipes.map(r => r.name).join(", ");
    
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Design a highly cohesive 7-day personalized Alkaline Vegan Meal Plan protocol.
Goal: ${goal}
Preferences: ${preferences}

Available Alchemical Recipes in the system: [${recipeNames}]

INSTRUCTIONS:
1. RELEVANCE: For each meal (Breakfast, Lunch, Dinner, Snack), try to integrate the specific recipe names listed above if they fit the goal. 
2. COHESION: If an existing recipe doesn't fit, invent a new high-alkaline meal name that sounds consistent with the "Biological Immortality" theme.
3. STRATEGY: Ensure the plan follows a logical progression of detoxification and cellular reset.
4. PURITY: All suggested meals must be strictly alkaline-forming (no hybrids, no starch-heavy acids).

Return a structured JSON protocol following the schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Evocative protocol title (e.g., 'The Telomere Reset Matrix')" },
            goal: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: "e.g. Day 1: Initiation" },
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
      contents: `Act as a high-level biological advisor for the Immortalist community. Explain the alkaline vegan perspective on: "${query}". 
Key pillars: cellular pH balance, reversing biological aging, eliminating mucus, and DNA repair. 
Maintain a tone that is scientific, visionary, and encouraging.`,
    });
    return response.text || "The matrix is recalibrating.";
  }

  async getFoodInsight(foodName: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As an Alchemist of Longevity, provide a deep insight into the element: "${foodName}". 
1. Explain its cellular rejuvenation properties (e.g., DNA repair, mitochondrial support).
2. Detail its specific high-alkaline benefits for biological immortality.
3. Provide 2-3 "Alchemical Preparation" tips to maximize its pH-balancing power.
Maintain a visionary, scientific, and inspiring tone. Keep it under 200 words.`,
    });
    return response.text || "Scanning cellular data... The essence of this element is currently obscured.";
  }
}

export const geminiService = new GeminiService();
