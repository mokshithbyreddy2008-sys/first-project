import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Leaf,
  WheatOff,
  AlertTriangle,
  Star,
  Sparkles,
  X,
} from 'lucide-react';
import useAppStore from '../store/useAppStore';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'appetizers', label: 'Appetizers' },
  { id: 'main_courses', label: 'Main Courses' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'chef_specials', label: "Chef's Specials" },
];

const ALLERGEN_FILTERS = [
  'dairy',
  'gluten',
  'nuts',
  'shellfish',
  'eggs',
  'soy',
  'fish',
  'sesame',
];

const CATEGORY_EMOJIS = {
  appetizers: '🍽️',
  main_courses: '🥩',
  desserts: '🍰',
  beverages: '🍷',
  chef_specials: '⭐',
};

export default function MenuView() {
  const { menuItems, menuLoading, loadMenuItems, profile } = useAppStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [excludeAllergens, setExcludeAllergens] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [veganOnly, setVeganOnly] = useState(false);
  const [gfOnly, setGfOnly] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const toggleAllergen = (allergen) => {
    setExcludeAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    );
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      // Search
      if (
        search &&
        !item.name.toLowerCase().includes(search.toLowerCase()) &&
        !item.description?.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      // Allergens
      if (
        excludeAllergens.length > 0 &&
        item.allergens?.some((a) => excludeAllergens.includes(a))
      )
        return false;
      // Vegan
      if (veganOnly && !item.is_vegan) return false;
      // GF
      if (gfOnly && !item.is_gluten_free) return false;
      return true;
    });
  }, [menuItems, activeCategory, search, excludeAllergens, veganOnly, gfOnly]);

  // Check if a dish matches user's dietary preferences
  const isAiMatch = (item) => {
    const prefs = profile?.dietary_preferences || [];
    if (prefs.length === 0) return false;
    if (prefs.includes('vegan') && item.is_vegan) return true;
    if (prefs.includes('gluten_free') && item.is_gluten_free) return true;
    if (prefs.includes('vegetarian') && (item.is_vegan || !item.allergens?.includes('meat')))
      return true;
    return false;
  };

  const activeFilterCount =
    excludeAllergens.length + (veganOnly ? 1 : 0) + (gfOnly ? 1 : 0);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-amber-500 text-sm font-semibold tracking-[0.2em] uppercase">
            Our Menu
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
            Culinary Masterpieces
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Each dish is a canvas of flavor, crafted with the finest seasonal ingredients
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, ingredients..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
              id="menu-search"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
              showFilters || activeFilterCount > 0
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:border-white/20'
            }`}
            id="menu-filter-toggle"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-xs">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            showFilters ? 'max-h-[200px] opacity-100 mb-6' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <button
                onClick={() => setVeganOnly(!veganOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  veganOnly
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 border'
                    : 'bg-zinc-800/60 border-white/10 text-zinc-400 border hover:border-white/20'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" /> Vegan Only
              </button>
              <button
                onClick={() => setGfOnly(!gfOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  gfOnly
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 border'
                    : 'bg-zinc-800/60 border-white/10 text-zinc-400 border hover:border-white/20'
                }`}
              >
                <WheatOff className="w-3.5 h-3.5" /> Gluten Free
              </button>
            </div>
            <p className="text-xs text-zinc-500 mb-2">Exclude allergens:</p>
            <div className="flex flex-wrap gap-2">
              {ALLERGEN_FILTERS.map((allergen) => {
                const active = excludeAllergens.includes(allergen);
                return (
                  <button
                    key={allergen}
                    onClick={() => toggleAllergen(allergen)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-red-500/20 border-red-500/40 text-red-300 border'
                        : 'bg-zinc-800/60 border-white/10 text-zinc-400 border hover:border-white/20'
                    }`}
                  >
                    {allergen}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 border'
                  : 'bg-zinc-900/60 border-white/5 text-zinc-400 border hover:border-white/10 hover:text-zinc-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {menuLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const matched = isAiMatch(item);
              const emoji = CATEGORY_EMOJIS[item.category] || '🍽️';
              return (
                <div
                  key={item.id}
                  className="group relative p-6 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-amber-500/20 transition-all duration-500 overflow-hidden"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    {/* Top Row: Category & Badges */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">{emoji}</span>
                      <div className="flex items-center gap-2">
                        {matched && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 text-xs font-semibold">
                            <Sparkles className="w-3 h-3" /> AI Match
                          </span>
                        )}
                        {item.is_vegan && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium">
                            <Leaf className="w-3 h-3" /> Vegan
                          </span>
                        )}
                        {item.is_gluten_free && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-medium">
                            <WheatOff className="w-3 h-3" /> GF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Name & Description */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Allergen Tags */}
                    {item.allergens?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {item.allergens.map((allergen) => (
                          <span
                            key={allergen}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-500 text-xs"
                          >
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {allergen}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price & Rating */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                        ${item.price?.toFixed(2)}
                      </span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`w-3 h-3 ${
                              j < 4
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-zinc-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No dishes found</h3>
            <p className="text-zinc-400">
              Try adjusting your search or filters to find something delicious
            </p>
            <button
              onClick={() => {
                setSearch('');
                setActiveCategory('all');
                setExcludeAllergens([]);
                setVeganOnly(false);
                setGfOnly(false);
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 font-medium hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Results Count */}
        {!menuLoading && filteredItems.length > 0 && (
          <p className="text-center text-sm text-zinc-500 mt-8">
            Showing {filteredItems.length} of {menuItems.length} dishes
          </p>
        )}
      </div>
    </div>
  );
}
