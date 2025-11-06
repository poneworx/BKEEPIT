import { create } from 'zustand';
type State = { userId: string | null; verified: boolean; set: (s: Partial<State>) => void; };
export const useAuthStore = create<State>(set => ({ userId: null, verified: false, set }));