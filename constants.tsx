
import React from 'react';
import { Recipe, FoodItem } from './types';

export const ALKALINE_FOODS: FoodItem[] = [
  { name: 'Watermelon', ph: 9.0, benefits: 'High hydration, flushes toxins', category: 'Fruit' },
  { name: 'Lemons', ph: 9.0, benefits: 'Instant alkalizer, vitamin C', category: 'Fruit' },
  { name: 'Kale', ph: 8.5, benefits: 'Iron, chlorophyll, bone health', category: 'Vegetable' },
  { name: 'Cucumber', ph: 8.0, benefits: 'Hydrating, silica for skin', category: 'Vegetable' },
  { name: 'Avocado', ph: 8.0, benefits: 'Healthy fats, brain fuel', category: 'Fruit' },
  { name: 'Almonds', ph: 7.5, benefits: 'Proteins, calcium, magnesium', category: 'Nut/Seed' },
  { name: 'Quinoa', ph: 7.2, benefits: 'Complete protein, fiber', category: 'Grain' },
  { name: 'Sprouts', ph: 8.5, benefits: 'Enzymatic activity, life force', category: 'Vegetable' },
];

export const PRESET_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Eternal Rejuvenation Salad',
    description: 'A powerful blend of high-alkaline greens designed to reset your biological clock.',
    ingredients: ['2 cups Kale', '1 Cucumber', '1 Avocado', '1/4 cup Sprouts', 'Lemon & Tahini dressing'],
    instructions: [
      'Massage kale with lemon juice to soften.',
      'Slice cucumber and avocado into bite-sized pieces.',
      'Toss all ingredients in a large bowl.',
      'Drizzle with tahini and serve immediately.'
    ],
    prepTime: '15 mins',
    category: 'Healing',
    alkalinityLevel: 9,
    imageUrl: 'https://picsum.photos/seed/salad/800/600'
  },
  {
    id: '2',
    name: 'Alkaline Weight-Shred Smoothie',
    description: 'Metabolic booster that targets cellular inflammation.',
    ingredients: ['1 cup Spinach', '1/2 Cucumber', '1 Green Apple', '1 tbsp Hemp Seeds', '2 cups Alkaline Water'],
    instructions: [
      'Blend all ingredients until smooth.',
      'Add ice if desired.',
      'Drink on an empty stomach for maximum absorption.'
    ],
    prepTime: '5 mins',
    category: 'Weight Loss',
    alkalinityLevel: 8,
    imageUrl: 'https://picsum.photos/seed/smoothie/800/600'
  }
];

export const Icons = {
  Leaf: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.856.12-1.683.342-2.466" />
    </svg>
  ),
  Bolt: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  Chart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
  ),
  Heart: ({ fill = false }: { fill?: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={fill ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  )
};
