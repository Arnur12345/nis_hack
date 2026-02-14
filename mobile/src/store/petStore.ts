import { create } from 'zustand';
import { Pet } from '../types';
import * as petApi from '../api/pet';

interface PetState {
  pet: Pet | null;
  isLoading: boolean;
  fetchPet: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  setPet: (pet: Pet) => void;
}

export const usePetStore = create<PetState>((set) => ({
  pet: null,
  isLoading: false,

  fetchPet: async () => {
    set({ isLoading: true });
    try {
      const { data } = await petApi.getPet();
      set({ pet: data.pet, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  updateName: async (name) => {
    const { data } = await petApi.updatePetName(name);
    set({ pet: data.pet });
  },

  setPet: (pet) => set({ pet }),
}));
