import { create } from 'zustand';
type PinState = { hasPin: boolean; setHasPin: (v:boolean)=>void };
export const usePinStore = create<PinState>(set => ({ hasPin:false, setHasPin:v=>set({hasPin:v}) }));