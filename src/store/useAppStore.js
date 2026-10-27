import { create } from 'zustand';
import {
  supabase,
  fetchProfile,
  fetchMenuItems,
  fetchReservations,
} from '../services/supabase';

// ── Demo menu data (used when Supabase is not configured) ───
const DEMO_MENU = [
  {
    id: '1', name: 'Truffle Burrata', description: 'Creamy burrata with black truffle shavings, heirloom tomatoes, and aged balsamic reduction',
    price: 18.5, category: 'appetizers', allergens: ['dairy'], is_vegan: false, is_gluten_free: true, image_url: '', is_available: true,
  },
  {
    id: '2', name: 'Mediterranean Mezze Platter', description: 'Hummus, baba ganoush, falafel bites, pickled vegetables, and warm pita bread',
    price: 16.0, category: 'appetizers', allergens: ['gluten', 'sesame'], is_vegan: true, is_gluten_free: false, image_url: '', is_available: true,
  },
  {
    id: '3', name: 'Lobster Bisque', description: 'Velvety lobster bisque with cognac cream and micro herbs',
    price: 14.0, category: 'appetizers', allergens: ['shellfish', 'dairy'], is_vegan: false, is_gluten_free: true, image_url: '', is_available: true,
  },
  {
    id: '4', name: 'Wagyu Beef Tenderloin', description: 'A5 wagyu with roasted bone marrow butter, truffle mash, and seasonal vegetables',
    price: 62.0, category: 'main_courses', allergens: ['dairy'], is_vegan: false, is_gluten_free: true, image_url: '', is_available: true,
  },
  {
    id: '5', name: 'Pan-Seared Chilean Sea Bass', description: 'Chilean sea bass with saffron risotto, beurre blanc, and crispy capers',
    price: 48.0, category: 'main_courses', allergens: ['fish', 'dairy'], is_vegan: false, is_gluten_free: true, image_url: '', is_available: true,
  },
  {
    id: '6', name: 'Wild Mushroom Risotto', description: 'Arborio rice with porcini, chanterelle, and king oyster mushrooms, finished with truffle oil',
    price: 34.0, category: 'main_courses', allergens: [], is_vegan: true, is_gluten_free: true, image_url: '', is_available: true,
  },
  {
    id: '7', name: 'Herb-Crusted Rack of Lamb', description: 'New Zealand lamb rack with rosemary jus, roasted root vegetables, and mint gremolata',
    price: 52.0, category: 'main_courses', allergens: ['gluten'], is_vegan: false, is_gluten_free: false, image_url: '', is_available: true,
  },
  {
    id: '8', name: 'Grilled Salmon Teriyaki', description: 'Atlantic salmon with house-made teriyaki glaze, jasmine rice, and stir-fried Asian greens',
    price: 38.0, category: 'main_courses', allergens: ['fish', 'soy'], is_vegan: false, is_gluten_free: true, image_url: '', is_available: true,
  },
  {
    id: '9', name: 'Chocolate Lava Fondant', description: 'Valrhona dark chocolate fondant with a molten center, served with vanilla bean gelato',
    price: 16.0, category: 'desserts', allergens: ['dairy', 'gluten', 'eggs'], is_vegan: false, is_gluten_free: false, image_url: '', is_available: true,
  },
  {
    id: '10', name: 'Crème Brûlée', description: 'Classic Tahitian vanilla crème brûlée with caramelized sugar crust and seasonal berries',
    price: 14.0, category: 'desserts', allergens: ['dairy', 'eggs'], is_vegan: false, is_gluten_free: true, image_url: '', is_available: true,
  },
  {
    id: '11', name: 'Mango Panna Cotta', description: 'Coconut panna cotta with Alphonso mango coulis and passion fruit pearls',
    price: 13.0, category: 'desserts', allergens: [], is_vegan: true, is_gluten_free: true, image_url: '', is_available: true,
  },
  {
    id: '12', name: 'Artisan Cheese Board', description: 'Selection of five aged artisan cheeses with honeycomb, fig compote, and walnut bread',
    price: 22.0, category: 'desserts', allergens: ['dairy', 'nuts', 'gluten'], is_vegan: false, is_gluten_free: false, image_url: '', is_available: true,
  },
  {
    id: '13', name: 'Signature Espresso Martini', description: 'Freshly pulled espresso, premium vodka, Kahlúa, and a hint of vanilla',
    price: 18.0, category: 'beverages', allergens: [], is_vegan: true, is_gluten_free: true, image_url: '', is_available: true,
  },
  {
    id: '14', name: 'Lavender Honey Lemonade', description: 'House-made lemonade infused with Provençal lavender and wildflower honey',
    price: 8.0, category: 'beverages', allergens: [], is_vegan: true, is_gluten_free: true, image_url: '', is_available: true,
  },
  {
    id: '15', name: 'Sommelier\'s Wine Flight', description: 'Three curated wines — a crisp Chablis, a velvety Pinot Noir, and a bold Barolo',
    price: 28.0, category: 'beverages', allergens: ['sulfites'], is_vegan: true, is_gluten_free: true, image_url: '', is_available: true,
  },
  {
    id: '16', name: 'Chef\'s Tasting Amuse-Bouche', description: 'A surprise five-course tasting experience crafted by our executive chef with seasonal ingredients',
    price: 85.0, category: 'chef_specials', allergens: ['varies'], is_vegan: false, is_gluten_free: false, image_url: '', is_available: true,
  },
  {
    id: '17', name: 'Seared Duck Breast à l\'Orange', description: 'Sous-vide duck breast with Grand Marnier orange glaze, pommes dauphine, and wilted spinach',
    price: 46.0, category: 'chef_specials', allergens: ['dairy', 'gluten'], is_vegan: false, is_gluten_free: false, image_url: '', is_available: true,
  },
  {
    id: '18', name: 'Deconstructed Tiramisu', description: 'A modern take on the Italian classic — espresso-soaked savoiardi, mascarpone mousse, and cocoa dust',
    price: 17.0, category: 'chef_specials', allergens: ['dairy', 'gluten', 'eggs'], is_vegan: false, is_gluten_free: false, image_url: '', is_available: true,
  },
];

const useAppStore = create((set, get) => ({
  // ── View State ──────────────────────────────────────────
  currentView: 'home',
  setView: (view) => set({ currentView: view }),

  // ── Auth State ──────────────────────────────────────────
  session: null,
  profile: null,
  authLoading: true,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),

  // ── Menu State ──────────────────────────────────────────
  menuItems: [],
  menuLoading: false,
  menuError: null,

  // ── Reservation State ───────────────────────────────────
  reservations: [],
  reservationsLoading: false,
  reservationsError: null,

  // ── Toast / Notifications ──────────────────────────────
  toasts: [],
  addToast: (toast) => {
    const id = Date.now() + Math.random();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },

  // ── Initialize Auth Listener ───────────────────────────
  initAuth: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, authLoading: false });
      if (session?.user) {
        get().loadProfile(session.user.id);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, authLoading: false });
      if (session?.user) {
        get().loadProfile(session.user.id);
      } else {
        set({ profile: null, reservations: [] });
      }
    });
  },

  // ── Load Profile ───────────────────────────────────────
  loadProfile: async (userId) => {
    try {
      const profile = await fetchProfile(userId);
      set({ profile });
    } catch (error) {
      // Profile might not exist yet (trigger may be delayed)
      console.warn('Profile fetch failed:', error.message);
      // Set a fallback profile from session metadata
      const session = get().session;
      if (session?.user) {
        set({
          profile: {
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || 'Guest User',
            email: session.user.email,
            role: 'customer',
            dietary_preferences: session.user.user_metadata?.dietary_preferences || [],
          },
        });
      }
    }
  },

  // ── Load Menu Items ────────────────────────────────────
  loadMenuItems: async () => {
    set({ menuLoading: true, menuError: null });
    try {
      const items = await fetchMenuItems();
      set({ menuItems: items.length > 0 ? items : DEMO_MENU, menuLoading: false });
    } catch (error) {
      console.warn('Menu fetch failed, using demo data:', error.message);
      set({ menuItems: DEMO_MENU, menuLoading: false });
    }
  },

  // ── Load Reservations ──────────────────────────────────
  loadReservations: async (userId) => {
    set({ reservationsLoading: true, reservationsError: null });
    try {
      const reservations = await fetchReservations(userId);
      set({ reservations, reservationsLoading: false });
    } catch (error) {
      console.warn('Reservations fetch failed:', error.message);
      set({ reservations: [], reservationsLoading: false, reservationsError: error.message });
    }
  },
}));

export default useAppStore;
