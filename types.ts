
export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  category: 'Healing' | 'Weight Loss' | 'Anti-Cancer' | 'General Vitality';
  alkalinityLevel: number; // 1-10
  imageUrl?: string;
}

export interface FoodItem {
  name: string;
  ph: number;
  benefits: string;
  category: 'Fruit' | 'Vegetable' | 'Grain' | 'Nut/Seed' | 'Legume';
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum AppView {
  Home = 'home',
  Recipes = 'recipes',
  Guide = 'guide',
  AIAssistant = 'ai-assistant'
}
