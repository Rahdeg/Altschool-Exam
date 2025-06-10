import { create } from "zustand";

export const useRepoModal = create((set) => ({
  isOpen: false,
  mode: "create", // or 'edit'
  data: null, // repo to edit
  openModal: (mode = "create", data = null) =>
    set({ isOpen: true, mode, data }),
  closeModal: () => set({ isOpen: false, mode: "create", data: null }),
}));
