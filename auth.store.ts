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
            // Fake user that matches your User type (including required avatar)
            const fakeUser: User = {
                name: 'Test User',
                email: 'test@example.com',
                avatar: 'https://ui-avatars.com/api/?name=Test+User&background=0D8ABC&color=fff',  // required field added
                // If TS complains about more Document fields, add them too:
                // $createdAt: new Date().toISOString(),
                // $updatedAt: new Date().toISOString(),
            };

            set({ isAuthenticated: true, user: fakeUser });
        } catch (e) {
            console.log('fetchAuthenticatedUser error', e);
            set({ isAuthenticated: false, user: null });
        } finally {
            set({ isLoading: false });
        }
    }
}))

export default useAuthStore;