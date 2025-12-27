
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppView, Recipe, ChatMessage, MealPlan, FoodItem } from './types';
import { PRESET_RECIPES, ALKALINE_FOODS, Icons } from './constants';
import { geminiService } from './services/geminiService';

// --- Sub-components ---

const Navbar: React.FC<{ currentView: AppView; setView: (v: AppView) => void }> = ({ currentView, setView }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-100 px-6 py-3 flex justify-around items-center z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
    <button 
      onClick={() => setView(AppView.Home)}
      className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.Home ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-emerald-400'}`}
    >
      <Icons.Leaf />
      <span className="text-[10px] font-semibold uppercase tracking-wider">Essence</span>
    </button>
    <button 
      onClick={() => setView(AppView.Recipes)}
      className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.Recipes ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-emerald-400'}`}
    >
      <Icons.Sparkles />
      <span className="text-[10px] font-semibold uppercase tracking-wider">Alchemy</span>
    </button>
    <button 
      onClick={() => setView(AppView.Plans)}
      className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.Plans ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-emerald-400'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
      <span className="text-[10px] font-semibold uppercase tracking-wider">Plans</span>
    </button>
    <button 
      onClick={() => setView(AppView.Guide)}
      className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.Guide ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-emerald-400'}`}
    >
      <Icons.Chart />
      <span className="text-[10px] font-semibold uppercase tracking-wider">Matrix</span>
    </button>
    <button 
      onClick={() => setView(AppView.AIAssistant)}
      className={`flex flex-col items-center gap-1 transition-all ${currentView === AppView.AIAssistant ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-emerald-400'}`}
    >
      <Icons.Bolt />
      <span className="text-[10px] font-semibold uppercase tracking-wider">Oracle</span>
    </button>
  </nav>
);

const RecipeModal: React.FC<{ recipe: Recipe; onClose: () => void; isFavorite: boolean; onToggleFavorite: (r: Recipe) => void }> = ({ recipe, onClose, isFavorite, onToggleFavorite }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
    <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-slate-400 hover:text-slate-800 transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative h-64 md:h-96 overflow-hidden">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.name} 
          className="w-full h-full object-cover animate-in zoom-in-110 duration-[2500ms] ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-2 block">{recipe.category}</span>
          <h2 className="text-4xl font-bold text-slate-900 leading-tight">{recipe.name}</h2>
        </div>
      </div>

      <div className="p-8 pt-4 space-y-8">
        <div className="flex flex-wrap gap-4 items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alkalinity</div>
              <div className="text-emerald-600 font-bold text-lg">pH {recipe.alkalinityLevel}+</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prep Time</div>
              <div className="text-slate-700 font-bold text-lg">{recipe.prepTime}</div>
            </div>
          </div>
          <button 
            onClick={() => onToggleFavorite(recipe)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all transform active:scale-95 ${
              isFavorite ? 'bg-rose-500 text-white shadow-md shadow-rose-200' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
            }`}
          >
            <Icons.Heart fill={isFavorite} />
            {isFavorite ? 'Saved to Matrix' : 'Save Alchemy'}
          </button>
        </div>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
            Essential Elements
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600 text-sm bg-slate-50 p-3 rounded-2xl hover:bg-emerald-50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                {ing}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
            The Path of Preparation
          </h3>
          <div className="space-y-4">
            {recipe.instructions.map((step, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                  {i + 1}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="font-bold text-emerald-900 text-sm mb-2">Immortality Insight</h4>
            <p className="text-emerald-700 text-xs leading-relaxed opacity-80">
              This blend targets cellular acidity. High-alkaline fuel maintain a resting pH balance that discourages inflammatory markers.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FoodDetailModal: React.FC<{ food: FoodItem; onClose: () => void }> = ({ food, onClose }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    geminiService.getFoodInsight(food.name).then(res => {
      if (active) {
        setInsight(res);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [food.name]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest block mb-1">{food.category}</span>
              <h2 className="text-3xl font-bold text-slate-900">{food.name}</h2>
            </div>
            <div className="bg-emerald-50 text-emerald-700 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg border border-emerald-100">
              {food.ph.toFixed(1)}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Immediate Benefits</h4>
            <p className="text-slate-700 text-sm leading-relaxed">{food.benefits}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
              <Icons.Bolt />
              Biological Deep Scan
            </h4>
            {loading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
                <div className="h-4 bg-slate-100 rounded-full w-4/6"></div>
              </div>
            ) : (
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap italic">
                {insight}
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};

const MealPlanModal: React.FC<{ plan: MealPlan; onClose: () => void }> = ({ plan, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
    <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-300">
      <header className="mb-10 text-center">
        <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-3 block">Matrix Protocol: {plan.goal}</span>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900">{plan.title}</h2>
        <p className="text-slate-400 text-sm mt-3">Generated on {plan.createdDate}</p>
      </header>

      <div className="space-y-6">
        {plan.days.map((day, idx) => (
          <div key={idx} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-emerald-200 transition-colors">
            <h3 className="text-xl font-bold text-emerald-900 mb-4">{day.day}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Breakfast', val: day.breakfast },
                { label: 'Lunch', val: day.lunch },
                { label: 'Dinner', val: day.dinner },
                { label: 'Snack', val: day.snack },
              ].map(meal => (
                <div key={meal.label} className="flex gap-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-20 flex-shrink-0">{meal.label}</div>
                  <div className="text-slate-700 text-sm">{meal.val}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onClose}
        className="mt-12 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors"
      >
        Close Protocol
      </button>
    </div>
  </div>
);

const RecipeCard: React.FC<{ 
  recipe: Recipe; 
  isFavorite: boolean; 
  onToggleFavorite: (r: Recipe) => void;
  onView: (r: Recipe) => void;
}> = ({ recipe, isFavorite, onToggleFavorite, onView }) => (
  <div 
    onClick={() => onView(recipe)}
    className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-emerald-50 relative group cursor-pointer"
  >
    <button 
      onClick={(e) => { e.stopPropagation(); onToggleFavorite(recipe); }}
      className={`absolute top-4 left-4 z-10 p-2.5 rounded-full backdrop-blur-md transition-all transform hover:scale-110 active:scale-90 ${
        isFavorite ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-white/70 text-slate-400 hover:text-rose-500'
      }`}
    >
      <Icons.Heart fill={isFavorite} />
    </button>
    <div className="h-56 relative overflow-hidden">
      <img 
        src={recipe.imageUrl} 
        alt={recipe.name} 
        className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000 ease-out" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="absolute top-4 right-4 bg-emerald-600/90 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
        pH {recipe.alkalinityLevel}+
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.2em]">{recipe.category}</span>
        <span className="text-slate-400 text-xs">{recipe.prepTime}</span>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-emerald-700 transition-colors duration-300">{recipe.name}</h3>
      <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed opacity-80">{recipe.description}</p>
      <button 
        className="w-full bg-emerald-50 text-emerald-700 py-3 rounded-2xl font-bold text-sm group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:-translate-y-1"
      >
        View Alchemy
      </button>
    </div>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.Home);
  const [recipes, setRecipes] = useState<Recipe[]>(PRESET_RECIPES);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeSearchQuery, setRecipeSearchQuery] = useState('');
  const [selectedGuideCategory, setSelectedGuideCategory] = useState<string>('All');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedFavs = localStorage.getItem('alkaline_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    
    const savedPlans = localStorage.getItem('alkaline_plans');
    if (savedPlans) setMealPlans(JSON.parse(savedPlans));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('alkaline_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('alkaline_plans', JSON.stringify(mealPlans));
  }, [mealPlans]);

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      const exists = prev.find(r => r.id === recipe.id);
      return exists ? prev.filter(r => r.id !== recipe.id) : [...prev, recipe];
    });
  };

  const isRecipeFavorite = (recipeId: string) => !!favorites.find(r => r.id === recipeId);

  const displayedRecipes = useMemo(() => {
    let base = showFavoritesOnly ? favorites : recipes;
    if (recipeSearchQuery.trim()) {
      const q = recipeSearchQuery.toLowerCase();
      base = base.filter(r => r.name.toLowerCase().includes(q));
    }
    return base;
  }, [recipes, favorites, showFavoritesOnly, recipeSearchQuery]);

  const filteredFoods = useMemo(() => {
    return ALKALINE_FOODS.filter(food => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = food.name.toLowerCase().includes(q) || food.benefits.toLowerCase().includes(q);
      const matchesCategory = selectedGuideCategory === 'All' || food.category === selectedGuideCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedGuideCategory]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: input };
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    try {
      const response = await geminiService.getAlkalineInsight(input);
      setChatHistory(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', content: "Protocol interrupted. Re-syncing matrix sensors." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateRecipe = async (goal: string) => {
    setIsGenerating(true);
    setView(AppView.Recipes);
    setShowFavoritesOnly(false);
    try {
      const newRecipe = await geminiService.generateAlkalineRecipe(goal, "Easy prep, high vibration.");
      setRecipes(prev => [newRecipe, ...prev]);
      setSelectedRecipe(newRecipe);
    } catch (error) {
      console.error("Alchemy failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMealPlan = async (goal: string) => {
    setIsGenerating(true);
    try {
      const newPlan = await geminiService.generateMealPlan(goal, "Prioritize longevity and genetic repair.", recipes);
      setMealPlans(prev => [newPlan, ...prev]);
      setSelectedMealPlan(newPlan);
      setView(AppView.Plans);
    } catch (error) {
      console.error("Meal plan synthesis failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20 bg-[#FDFDFE]">
      <Navbar currentView={view} setView={setView} />

      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)}
          isFavorite={isRecipeFavorite(selectedRecipe.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {selectedFood && (
        <FoodDetailModal food={selectedFood} onClose={() => setSelectedFood(null)} />
      )}

      {selectedMealPlan && (
        <MealPlanModal plan={selectedMealPlan} onClose={() => setSelectedMealPlan(null)} />
      )}

      <main className="max-w-4xl mx-auto px-6 pt-8">
        {view === AppView.Home && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="text-center space-y-4">
              <h1 className="text-4xl md:text-7xl font-bold text-slate-900 leading-tight">
                The Path to <br />
                <span className="text-emerald-600 italic">Biological Immortality</span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Unlock cellular rejuvenation through the Alkaline Vegan Diet. Heal your body and flourish in eternal health.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Heal Your Cells', desc: 'Reverse inflammation and genetic damage.', goal: 'Healing', icon: <Icons.Sparkles /> },
                { title: 'Disease Immunity', desc: 'Create an environment where illness cannot thrive.', goal: 'Anti-Cancer', icon: <Icons.Leaf /> },
                { title: 'Effortless Weight', desc: 'Shed metabolic waste naturally.', goal: 'Weight Loss', icon: <Icons.Bolt /> },
                { title: 'Optimize Longevity', desc: 'Maximize your biological potential.', goal: 'General Vitality', icon: <Icons.Chart /> },
              ].map((card) => (
                <button
                  key={card.title}
                  onClick={() => handleGenerateRecipe(card.goal)}
                  className="group relative p-10 bg-white rounded-[3rem] border border-emerald-50 text-left hover:border-emerald-200 transition-all shadow-sm hover:shadow-xl overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-emerald-50 rounded-[1.25rem] flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      {card.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">{card.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed opacity-80">{card.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <section className="bg-emerald-900 rounded-[3.5rem] p-12 text-white overflow-hidden relative shadow-2xl">
              <div className="relative z-10 space-y-6">
                <h2 className="text-4xl font-bold leading-tight">The Genesis <br/>Protocol</h2>
                <p className="text-emerald-100 opacity-80 max-w-lg text-lg">
                  Generate a personalized 7-day matrix designed for total biological reset.
                </p>
                <button 
                  onClick={() => handleGenerateMealPlan('General Rejuvenation')}
                  className="bg-white text-emerald-950 px-10 py-4 rounded-full font-bold hover:bg-emerald-100 transition-all transform hover:scale-105"
                >
                  Synthesize Protocol
                </button>
              </div>
            </section>
          </div>
        )}

        {view === AppView.Recipes && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-bold text-slate-900">Alkaline Alchemy</h2>
                  <p className="text-slate-500 mt-2">Transmute raw elements into life-extending fuel.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`px-5 py-3.5 rounded-3xl font-bold transition-all flex items-center gap-3 border shadow-sm ${
                      showFavoritesOnly ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-slate-100 text-slate-600'
                    }`}
                  >
                    <Icons.Heart fill={showFavoritesOnly} />
                    <span>Saved</span>
                  </button>
                  <button 
                    onClick={() => handleGenerateRecipe('Surprise Me')}
                    disabled={isGenerating}
                    className="bg-emerald-600 text-white px-8 py-3.5 rounded-3xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-3 disabled:opacity-50"
                  >
                    {isGenerating ? 'Synthesizing...' : 'Create New'}
                  </button>
                </div>
              </div>
              <input 
                type="text" 
                value={recipeSearchQuery}
                onChange={(e) => setRecipeSearchQuery(e.target.value)}
                placeholder="Search alchemies by name..."
                className="w-full bg-white border border-emerald-50 rounded-[1.5rem] px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
              {displayedRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  isFavorite={isRecipeFavorite(recipe.id)}
                  onToggleFavorite={toggleFavorite}
                  onView={setSelectedRecipe}
                />
              ))}
            </div>
          </div>
        )}

        {view === AppView.Plans && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-4xl font-bold text-slate-900">Protocols</h2>
                <p className="text-slate-500 mt-2">Your saved longevity matrices.</p>
              </div>
              <button 
                onClick={() => setView(AppView.AIAssistant)}
                className="bg-emerald-600 text-white px-8 py-3.5 rounded-3xl font-bold hover:bg-emerald-700 transition-all"
              >
                New Protocol
              </button>
            </header>

            {mealPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mealPlans.map(plan => (
                  <div 
                    key={plan.id}
                    onClick={() => setSelectedMealPlan(plan)}
                    className="bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.2em]">{plan.goal}</span>
                      <span className="text-slate-400 text-xs">{plan.createdDate}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{plan.title}</h3>
                    <p className="text-slate-400 text-sm mt-2">A 7-day cellular rejuvenation matrix.</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-[3rem] border border-emerald-50">
                <h3 className="text-xl font-bold text-slate-800">No Protocols Found</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2 mb-8">Generated meal plans will appear here.</p>
                <button 
                  onClick={() => setView(AppView.AIAssistant)}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all"
                >
                  Generate First Plan
                </button>
              </div>
            )}
          </div>
        )}

        {view === AppView.Guide && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header>
              <h2 className="text-4xl font-bold text-slate-900">The pH Matrix</h2>
              <p className="text-slate-500 mt-2">A scanner for biological rechargers. Click an element to deep-scan its essence.</p>
            </header>
            <div className="bg-white rounded-[3rem] border border-emerald-50 overflow-hidden shadow-sm p-6">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search elements..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b">
                      <th className="pb-4 px-2">Element</th>
                      <th className="pb-4 px-2">pH</th>
                      <th className="pb-4 px-2">Vitality Core</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFoods.map(food => (
                      <tr 
                        key={food.name} 
                        onClick={() => setSelectedFood(food)}
                        className="border-b last:border-0 hover:bg-emerald-50/50 transition-colors cursor-pointer group"
                      >
                        <td className="py-5 px-2 font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{food.name}</td>
                        <td className="py-5 px-2">
                          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                            {food.ph.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-5 px-2 text-sm text-slate-500 leading-relaxed">{food.benefits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === AppView.AIAssistant && (
          <div className="h-[calc(100vh-220px)] flex flex-col animate-in fade-in duration-500">
            <header className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-bold text-slate-900">The Oracle</h2>
                <p className="text-slate-500 mt-2">Consult the intelligence.</p>
              </div>
              <button 
                onClick={() => handleGenerateMealPlan('Custom Request')}
                disabled={isGenerating}
                className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
              >
                {isGenerating ? 'Synthesizing...' : 'New Plan'}
              </button>
            </header>

            <div className="flex-1 bg-white rounded-[3rem] border border-emerald-50 p-8 overflow-y-auto space-y-6 mb-6">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-6 py-4 rounded-[2rem] text-sm leading-relaxed ${
                    msg.role === 'user' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-700 border border-slate-100'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isGenerating && <div className="text-emerald-400 text-xs animate-pulse font-medium px-4">Consulting the higher logic...</div>}
            </div>

            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about immortality or request a custom plan..."
                className="w-full bg-white border border-emerald-100 rounded-[2rem] px-8 py-5 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isGenerating || !input.trim()}
                className="absolute right-3 top-3 bottom-3 bg-emerald-600 text-white px-6 rounded-[1.5rem] font-bold hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
