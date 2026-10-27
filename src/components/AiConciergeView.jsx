import React, { useEffect, useState, useRef } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  ChefHat,
  Star,
  MessageCircle,
  Zap,
  RefreshCw,
  User,
  Bot,
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { getAiRecommendations, chatWithConcierge } from '../services/aiService';

const QUICK_PROMPTS = [
  "What's perfect for a date night?",
  'I want something light and fresh',
  'Best dishes for vegans?',
  'What wine pairs with seafood?',
  'Recommend a full-course meal',
  "What's gluten-free on the menu?",
];

export default function AiConciergeView() {
  const { profile, menuItems, loadMenuItems, session } = useAppStore();
  const [recommendations, setRecommendations] = useState(null);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsError, setRecsError] = useState(null);

  // Chat state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Welcome to Aurélien's AI Concierge! 🌟 I'm here to help you discover the perfect dining experience. Ask me about our menu, dietary options, wine pairings, or get personalized dish recommendations!",
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (menuItems.length === 0) loadMenuItems();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleGetRecommendations = async () => {
    setRecsLoading(true);
    setRecsError(null);
    try {
      const userProfile = profile || {
        full_name: 'Guest',
        dietary_preferences: [],
      };
      const result = await getAiRecommendations(userProfile, menuItems);
      setRecommendations(result);
    } catch (err) {
      setRecsError(err.message);
    } finally {
      setRecsLoading(false);
    }
  };

  const handleSendChat = async (message) => {
    const text = message || chatInput.trim();
    if (!text) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const userProfile = profile || {
        full_name: 'Guest',
        dietary_preferences: [],
      };
      const result = await chatWithConcierge(text, userProfile, menuItems);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: result.reply,
          dishes: result.suggestedDishes,
        },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            "I apologize, but I'm having a moment. Could you try asking again? I want to give you the best dining advice possible!",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl shadow-violet-500/20 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
            AI Culinary Concierge
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Powered by Gemini AI — your personal guide to the perfect dining experience
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ── Left: Smart Recommendations ─────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Smart Recommendations
              </h2>
              <button
                onClick={handleGetRecommendations}
                disabled={recsLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 transition-all cursor-pointer"
                id="ai-get-recs"
              >
                {recsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : recommendations ? (
                  <RefreshCw className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {recommendations ? 'Refresh' : 'Get Picks'}
              </button>
            </div>

            {recsError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5">
                {recsError}
              </div>
            )}

            {recsLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                  <Sparkles className="w-6 h-6 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-zinc-400 mt-4 text-sm">
                  Our AI is curating your perfect menu...
                </p>
              </div>
            )}

            {!recsLoading && recommendations && (
              <div className="space-y-4">
                {/* Greeting */}
                <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                  <p className="text-violet-300 text-sm leading-relaxed">
                    {recommendations.greeting}
                  </p>
                </div>

                {/* Recommendation Cards */}
                {recommendations.recommendations?.map((rec, i) => (
                  <div
                    key={i}
                    className="group p-5 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-amber-500/20 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                          #{i + 1}
                        </div>
                        <div>
                          <h3 className="text-white font-bold">{rec.dishName}</h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            {[...Array(5)].map((_, j) => (
                              <Star
                                key={j}
                                className={`w-3 h-3 ${
                                  j < Math.round(rec.matchScore / 20)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-zinc-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-bold">
                        {rec.matchScore}%
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-2">
                      {rec.reason}
                    </p>
                    <p className="text-xs text-violet-400 italic">
                      💡 {rec.pairingTip}
                    </p>
                  </div>
                ))}

                {/* Chef's Note */}
                {recommendations.chefNote && (
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15">
                    <div className="flex items-center gap-2 mb-2">
                      <ChefHat className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-semibold text-amber-300">
                        Chef&apos;s Note
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {recommendations.chefNote}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!recsLoading && !recommendations && !recsError && (
              <div className="p-12 rounded-2xl bg-zinc-900/60 border border-white/5 text-center">
                <Sparkles className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  Ready for Personalized Picks?
                </h3>
                <p className="text-zinc-400 text-sm mb-6">
                  Click "Get Picks" and our AI will analyze your dietary preferences
                  against our menu to find your perfect dishes.
                </p>
                {profile?.dietary_preferences?.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {profile.dietary_preferences.map((pref) => (
                      <span
                        key={pref}
                        className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-medium"
                      >
                        {pref.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Chat Interface ───────────────────────── */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-5">
              <MessageCircle className="w-5 h-5 text-violet-400" />
              Chat with Concierge
            </h2>

            {/* Chat Messages */}
            <div className="flex-1 min-h-[400px] max-h-[500px] overflow-y-auto p-5 rounded-t-2xl bg-zinc-900/60 border border-b-0 border-white/5 space-y-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      msg.role === 'user'
                        ? 'bg-amber-500/20'
                        : 'bg-violet-500/20'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Bot className="w-4 h-4 text-violet-400" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-100'
                        : 'bg-zinc-800/60 border border-white/5 text-zinc-300'
                    }`}
                  >
                    {msg.content}
                    {msg.dishes?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {msg.dishes.map((d, j) => (
                          <span
                            key={j}
                            className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-800/60 border border-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-3 bg-zinc-900/40 border-x border-white/5 overflow-x-auto">
              <div className="flex gap-2">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendChat(prompt)}
                    disabled={chatLoading}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-white/5 text-xs text-zinc-400 hover:text-amber-400 hover:border-amber-500/20 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex gap-3 p-4 rounded-b-2xl bg-zinc-900/60 border border-t-0 border-white/5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about our menu..."
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-800/60 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all text-sm"
                id="ai-chat-input"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={chatLoading || !chatInput.trim()}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-40 transition-all cursor-pointer"
                id="ai-chat-send"
              >
                {chatLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
