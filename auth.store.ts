import { create } from 'zustand'
import { User } from "@/type";

type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;

    setIsAuthenticated: (value: boolean) => void;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;

    fetchAuthenticatedUser: () => Promise<void>;

    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    isLoading: true,

    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    setUser: (user) => set({ user }),
    setLoading: (value) => set({ isLoading: value }),

    fetchAuthenticatedUser: async () => {
        set({ isLoading: true });

        try {
            // TODO: Real session check later (e.g. AsyncStorage or API call)
            // For now: always start logged OUT on app start/reload
            set({ isAuthenticated: false, user: null });
        } catch (e) {
            console.log('fetchAuthenticatedUser error', e);
            set({ isAuthenticated: false, user: null });
        } finally {
            set({ isLoading: false });
        }
    },

    logout: () => set({ isAuthenticated: false, user: null }),
}))

export default useAuthStore;