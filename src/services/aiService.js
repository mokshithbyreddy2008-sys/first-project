import { GoogleGenAI, Type } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let ai = null;
if (apiKey && apiKey !== 'your-google-gemini-api-key') {
  ai = new GoogleGenAI({ apiKey });
}

const SYSTEM_PROMPT = `You are an expert culinary AI concierge for "Aurélien" — an upscale smart restaurant. Your job is to analyze user dietary profiles and available menu items to provide precise, appetizing, and allergy-safe meal recommendations in valid JSON format. Be warm, knowledgeable, and enthusiastic about food. Include creative pairing suggestions and explain why each dish suits the diner.`;

/**
 * Get AI-powered dish recommendations based on user profile and menu
 */
export async function getAiRecommendations(userProfile, menuItems, customPrompt = '') {
  if (!ai) {
    return getDemoRecommendations(userProfile, menuItems);
  }

  try {
    const prompt = customPrompt
      ? `${customPrompt}\n\nUser Profile: ${JSON.stringify(userProfile)}.\nAvailable Menu Items: ${JSON.stringify(menuItems)}.`
      : `Analyze this diner's profile and recommend the best matching dishes from our menu.\n\nUser Profile: ${JSON.stringify(userProfile)}.\nAvailable Menu Items: ${JSON.stringify(menuItems)}.\n\nProvide personalized recommendations considering their dietary preferences and any allergen restrictions.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            greeting: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dishName: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  reason: { type: Type.STRING },
                  pairingTip: { type: Type.STRING },
                },
                required: ['dishName', 'matchScore', 'reason', 'pairingTip'],
              },
            },
            chefNote: { type: Type.STRING },
          },
          required: ['greeting', 'recommendations', 'chefNote'],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error(
      'Our AI sommelier is taking a brief pause. Please try again in a moment.'
    );
  }
}

/**
 * Chat with the AI concierge for general culinary questions
 */
export async function chatWithConcierge(message, userProfile, menuItems) {
  if (!ai) {
    return {
      reply: getDemoChatReply(message),
    };
  }

  try {
    const prompt = `The diner asks: "${message}"\n\nTheir profile: ${JSON.stringify(userProfile)}.\nOur menu: ${JSON.stringify(menuItems)}.\n\nRespond helpfully as a knowledgeable culinary concierge. If they ask about dishes, reference our actual menu.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            suggestedDishes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['reply'],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    throw new Error('Unable to reach our AI concierge right now. Please try again.');
  }
}

// ── Demo / Fallback Data ────────────────────────────────────

function getDemoRecommendations(userProfile, menuItems) {
  const prefs = userProfile?.dietary_preferences || [];
  const filtered = menuItems.filter((item) => {
    if (prefs.includes('vegan') && !item.is_vegan) return false;
    if (prefs.includes('gluten_free') && !item.is_gluten_free) return false;
    return true;
  });

  const picks = (filtered.length > 0 ? filtered : menuItems).slice(0, 4);

  return {
    greeting: `Welcome${userProfile?.full_name ? `, ${userProfile.full_name}` : ''}! I've curated tonight's selections especially for you.`,
    recommendations: picks.map((item, i) => ({
      dishName: item.name,
      matchScore: Math.round((95 - i * 5) * 10) / 10,
      reason: `This ${item.category.replace('_', ' ')} perfectly complements your ${prefs.length > 0 ? prefs.join(', ') : 'adventurous'} dining style.`,
      pairingTip: `Pairs beautifully with our sommelier's selected wine of the evening.`,
    })),
    chefNote:
      "Our chef recommends starting with a lighter appetizer before moving to the heartier main courses. Don't miss tonight's specials!",
  };
}

function getDemoChatReply(message) {
  const lower = message.toLowerCase();
  if (lower.includes('vegan') || lower.includes('plant')) {
    return "Wonderful choice! We have several exquisite vegan options. Our Wild Mushroom Risotto and the Mediterranean Mezze Platter are guest favorites. Each dish uses locally sourced, seasonal produce. Would you like me to recommend a full vegan tasting menu?";
  }
  if (lower.includes('allerg') || lower.includes('gluten')) {
    return "Your safety is our top priority. All our dishes are clearly marked with allergen information. Our kitchen team is trained to handle all dietary requirements. I'd recommend our Grilled Salmon and Roasted Vegetable Medley — both naturally gluten-free and absolutely delicious.";
  }
  if (lower.includes('dessert') || lower.includes('sweet')) {
    return "You have impeccable taste! Our Chocolate Lava Fondant is a timeless masterpiece — rich Valrhona chocolate with a molten center, served with vanilla bean gelato. For something lighter, the Crème Brûlée with seasonal berries is divine.";
  }
  if (lower.includes('wine') || lower.includes('drink') || lower.includes('beverage')) {
    return "Our sommelier has curated an exceptional wine list this season. For reds, I'd suggest the 2019 Château Reserve — full-bodied with notes of dark cherry and spice. For whites, the Chablis Premier Cru offers beautiful minerality. We also have craft cocktails and artisanal mocktails!";
  }
  return "That's a great question! As your culinary concierge, I'm here to help you navigate our menu and find the perfect dining experience. Whether you're looking for specific dietary options, wine pairings, or chef's recommendations, I'm at your service. What aspect of tonight's dining experience can I help you with?";
}
