import React from 'react';
import {
  ChefHat,
  Sparkles,
  Star,
  ArrowRight,
  UtensilsCrossed,
  Clock,
  MapPin,
  Phone,
  Award,
  Flame,
} from 'lucide-react';
import useAppStore from '../store/useAppStore';

const HIGHLIGHTS = [
  {
    icon: Award,
    title: 'Michelin Inspired',
    desc: 'Techniques perfected across three-star kitchens worldwide',
  },
  {
    icon: Flame,
    title: 'Live Kitchen',
    desc: 'Watch our chefs craft your dishes in our open kitchen',
  },
  {
    icon: Sparkles,
    title: 'AI Sommelier',
    desc: 'Personalized wine & dish pairings powered by AI',
  },
];

const FEATURED = [
  {
    name: 'Wagyu Beef Tenderloin',
    price: '$62',
    tag: "Chef's Choice",
    category: 'Main Course',
  },
  {
    name: 'Truffle Burrata',
    price: '$18.50',
    tag: 'Seasonal',
    category: 'Appetizer',
  },
  {
    name: 'Chocolate Lava Fondant',
    price: '$16',
    tag: 'Signature',
    category: 'Dessert',
  },
];

export default function HomeView() {
  const { setView, session } = useAppStore();

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-3xl" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 opacity-10 hidden lg:block">
          <UtensilsCrossed className="w-64 h-64 text-amber-500 rotate-12" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8 animate-fade-in">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm text-amber-300 font-medium tracking-wide">
              Award-Winning Culinary Experience
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight">
            <span className="text-white">Where Every</span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Bite Tells a Story
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience exquisite dining reimagined with AI-powered personalization.
            Your palate, your preferences, your perfect meal — curated just for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setView(session ? 'menu' : 'auth')}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-amber-500/25 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer"
              id="hero-cta-primary"
            >
              <ChefHat className="w-5 h-5" />
              {session ? 'Explore Our Menu' : 'Get Started'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setView('ai-concierge')}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl border border-amber-500/30 text-amber-400 font-semibold text-lg hover:bg-amber-500/10 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer"
              id="hero-cta-ai"
            >
              <Sparkles className="w-5 h-5" />
              Try AI Concierge
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-zinc-500 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-amber-500/50 to-transparent" />
        </div>
      </section>

      {/* ── Highlights Section ───────────────────────────────── */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-500 text-sm font-semibold tracking-[0.2em] uppercase">
              Why Aurélien
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
              A Dining Experience Like No Other
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {HIGHLIGHTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-amber-500/20 hover:bg-zinc-900/80 transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Menu Preview ────────────────────────────── */}
      <section className="py-24 px-4 bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-500 text-sm font-semibold tracking-[0.2em] uppercase">
              Tonight&apos;s Selections
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
              Featured Creations
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {FEATURED.map((dish, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl bg-zinc-800/50 border border-white/5 hover:border-amber-500/20 transition-all duration-500 overflow-hidden"
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
                      {dish.tag}
                    </span>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">
                      {dish.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{dish.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                      {dish.price}
                    </span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => setView('menu')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-amber-500/30 text-amber-400 font-semibold hover:bg-amber-500/10 transition-all cursor-pointer"
              id="featured-view-menu"
            >
              View Full Menu
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Info Bar ─────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-zinc-900 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <MapPin className="w-6 h-6 text-amber-400" />
            <p className="text-zinc-300 font-medium">42 Rue de la Gastronomie</p>
            <p className="text-zinc-500 text-sm">Paris, France</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Clock className="w-6 h-6 text-amber-400" />
            <p className="text-zinc-300 font-medium">Tue – Sun: 6PM – 11PM</p>
            <p className="text-zinc-500 text-sm">Closed Mondays</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Phone className="w-6 h-6 text-amber-400" />
            <p className="text-zinc-300 font-medium">+33 1 42 86 82 40</p>
            <p className="text-zinc-500 text-sm">Reservations Recommended</p>
          </div>
        </div>
      </section>
    </div>
  );
}
