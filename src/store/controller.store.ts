import { create } from "zustand";
import { persist } from "zustand/middleware";

type ControllerState = {
  controller: "BG" | "UPSCALE" | "LIGHTFIX" | "FRAMING";
  processing: boolean;
  setController: (
    controller: "BG" | "UPSCALE" | "LIGHTFIX" | "FRAMING"
  ) => void;
  setProcessing: (processing: boolean) => void;
};

export const useControllerStore = create<ControllerState>()(
  persist(
    (set) => ({
      controller: "BG",
      processing: false,
      setController: (
        controller: "BG" | "UPSCALE" | "LIGHTFIX" | "FRAMING"
      ) => set({ controller }),
      setProcessing: (processing: boolean) => set({ processing }),
    }),
    {
      name: "controller",
    }
  )
);
