
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppView, Recipe, ChatMessage } from './types';
import { PRESET_RECIPES, ALKALINE_FOODS, Icons } from './constants';
import { geminiService } from './services/geminiService';

// --- Sub-components (Defined outside for performance) ---

const Navbar: React.FC<{ currentView: AppView; setView: (v: AppView) => void }> = ({ currentView, setView }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-100 px-6 py-3 flex justify-around items-center z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
    <button 
      onClick={() => setView(AppView.Home)}
      className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.Home ? 'text-emerald-600' : 'text-slate-400'}`}
    >
      <Icons.Leaf />
      <span className="text-[10px] font-semibold uppercase tracking-wider">Essence</span>
    </button>
    <button 
      onClick={() => setView(AppView.Recipes)}
      className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.Recipes ? 'text-emerald-600' : 'text-slate-400'}`}
    >
      <Icons.Sparkles />
      <span className="text-[10px] font-semibold uppercase tracking-wider">Alchemy</span>
    </button>
    <button 
      onClick={() => setView(AppView.Guide)}
      className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.Guide ? 'text-emerald-600' : 'text-slate-400'}`}
    >
      <Icons.Chart />
      <span className="text-[10px] font-semibold uppercase tracking-wider">Matrix</span>
    </button>
    <button 
      onClick={() => setView(AppView.AIAssistant)}
      className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.AIAssistant ? 'text-emerald-600' : 'text-slate-400'}`}
    >
      <Icons.Bolt />
      <span className="text-[10px] font-semibold uppercase tracking-wider">Oracle</span>
    </button>
  </nav>
);

const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-emerald-50">
    <div className="h-48 relative overflow-hidden">
      <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
      <div className="absolute top-4 right-4 bg-emerald-600/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
        pH {recipe.alkalinityLevel}+
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">{recipe.category}</span>
        <span className="text-slate-400 text-xs">{recipe.prepTime}</span>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">{recipe.name}</h3>
      <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">{recipe.description}</p>
      <button className="w-full bg-emerald-50 text-emerald-700 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-colors">
        View Alchemy
      </button>
    </div>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.Home);
  const [recipes, setRecipes] = useState<Recipe[]>(PRESET_RECIPES);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredFoods = useMemo(() => {
    return ALKALINE_FOODS.filter(food => 
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.benefits.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
      setChatHistory(prev => [...prev, { role: 'model', content: "Error communicating with the Oracle. Ensure your path is clear." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateRecipe = async (goal: string) => {
    setIsGenerating(true);
    setView(AppView.Recipes);
    try {
      const newRecipe = await geminiService.generateAlkalineRecipe(goal, "Common alkaline vegetables, avocado, nuts");
      setRecipes(prev => [newRecipe, ...prev]);
    } catch (error) {
      console.error("Recipe generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pt-20">
      <Navbar currentView={view} setView={setView} />

      <main className="max-w-4xl mx-auto px-6 pt-8">
        {view === AppView.Home && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                The Secret of <br />
                <span className="text-emerald-600 italic">Biological Immortality</span>
              </h1>
              <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Unlock cellular rejuvenation through the Alkaline Vegan Diet. Heal your body, shed excess weight, and flourish in vibrant health.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Heal Your Body', desc: 'Reverse inflammation and cellular damage.', goal: 'Healing', icon: <Icons.Sparkles /> },
                { title: 'Combat Cancer', desc: 'Create an environment where disease cannot thrive.', goal: 'Anti-Cancer', icon: <Icons.Leaf /> },
                { title: 'Lose Weight', desc: 'Shed toxins and weight naturally.', goal: 'Weight Loss', icon: <Icons.Bolt /> },
                { title: 'Stay Healthy', desc: 'Optimize your biological lifespan.', goal: 'General Vitality', icon: <Icons.Chart /> },
              ].map((card) => (
                <button
                  key={card.title}
                  onClick={() => handleGenerateRecipe(card.goal)}
                  className="group relative p-8 bg-white rounded-[2rem] border border-emerald-50 text-left hover:border-emerald-200 transition-all shadow-sm hover:shadow-md overflow-hidden"
                >
                  <div className="absolute -right-4 -bottom-4 text-emerald-50 opacity-10 group-hover:scale-110 transition-transform">
                    {React.cloneElement(card.icon as React.ReactElement, { className: 'w-32 h-32' })}
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <section className="bg-emerald-900 rounded-[3rem] p-10 text-white overflow-hidden relative">
              <div className="relative z-10 space-y-4">
                <h2 className="text-3xl font-bold leading-tight">Your Cells Are Listening</h2>
                <p className="text-emerald-100 opacity-80 leading-relaxed max-w-lg">
                  Every bite is a chemical message to your DNA. Choosing high-alkaline fuel is the first step toward true biological longevity.
                </p>
                <button 
                  onClick={() => setView(AppView.AIAssistant)}
                  className="bg-emerald-400 text-emerald-950 px-8 py-3 rounded-full font-bold hover:bg-emerald-300 transition-colors"
                >
                  Ask the Oracle
                </button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
            </section>
          </div>
        )}

        {view === AppView.Recipes && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Alkaline Alchemy</h2>
                <p className="text-slate-500">Transformative meals for cellular renewal.</p>
              </div>
              <button 
                onClick={() => handleGenerateRecipe('Surprise Me')}
                disabled={isGenerating}
                className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? 'Synthesizing...' : 'Generate New Alchemy'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}

        {view === AppView.Guide && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">The pH Matrix</h2>
                <p className="text-slate-500">A guide to the most powerful alkaline ingredients on Earth.</p>
              </div>
              <div className="relative w-full md:w-64 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Scan for ingredients..."
                  className="w-full bg-white border border-emerald-100 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                />
              </div>
            </header>

            <div className="bg-white rounded-[2rem] border border-emerald-50 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Element</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">pH Energy</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Vitality Benefit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFoods.length > 0 ? (
                    filteredFoods.map((food) => (
                      <tr key={food.name} className="hover:bg-emerald-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{food.name}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">{food.category}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {food.ph.toFixed(1)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{food.benefits}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <div className="text-slate-400 text-sm font-medium">No ingredients found in the current matrix frequency.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-slate-100 rounded-[2rem] border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">Why Alkalinity Matters?</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Diseases like cancer, diabetes, and heart disease often thrive in acidic, inflammatory environments. By shifting your internal chemistry through alkaline-forming foods, you create a fortress of biological stability.
              </p>
            </div>
          </div>
        )}

        {view === AppView.AIAssistant && (
          <div className="h-[calc(100vh-180px)] flex flex-col animate-in fade-in duration-500">
            <header className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900">The Alkaline Oracle</h2>
              <p className="text-slate-500">Consult the source on longevity and healing.</p>
            </header>

            <div className="flex-1 bg-white rounded-[2rem] border border-emerald-50 p-6 overflow-y-auto space-y-4 mb-4 shadow-inner">
              {chatHistory.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <Icons.Bolt />
                  </div>
                  <p className="text-slate-400 max-w-xs">Ask anything about alkaline living, cellular healing, or how to reach biological immortality.</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-700 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 px-5 py-3 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about immortality or healing..."
                className="w-full bg-white border border-emerald-100 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isGenerating || !input.trim()}
                className="absolute right-2 top-2 bottom-2 bg-emerald-600 text-white px-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
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
