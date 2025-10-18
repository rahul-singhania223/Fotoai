import { create } from "zustand";

interface ModelStoreProps {
  isOpen: boolean;
  name: "SUBSCRIPTION";
  onOpen: (name: "SUBSCRIPTION") => void;
  onClose: () => void;
}

export const useModal = create<ModelStoreProps>((set) => ({
  isOpen: false,
  name: "SUBSCRIPTION",
  onOpen: (name: "SUBSCRIPTION") => set({ isOpen: true, name }),
  onClose: () => set({ isOpen: false }),
}));
