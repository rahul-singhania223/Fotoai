import { User } from "@/generated/prisma";
import { create } from "zustand";

interface UserStoreProps {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStoreProps>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));
