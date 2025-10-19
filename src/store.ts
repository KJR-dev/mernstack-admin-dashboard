import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface User {
    id: number,
    firstName: string;
    laseName: string;
    email: string;
    role: string;
};

interface AuthState {
    user: null | User;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
})));

// export const useAuthStore = create((set) => ({
//     user: null
// }))