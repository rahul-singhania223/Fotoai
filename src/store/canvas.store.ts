import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CanvasState {
  backgroundImage: string | null;
  backgroundColor: string | null;
  dimensions: { width: number; height: number } | null;
  imageDimensions : { width: number; height: number } | null;
  format: string | null;
  imageSrc: string | null;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
  setFormat: (format: string) => void;
  setImageSrc: (imageUrl: string | null) => void;
  setBackgroundImage: (imageUrl: string | null) => void;
  setBackgroundColor: (color: string | null) => void;
  setDimensions: (width: number, height: number) => void;
  setImageDimensions: (width: number, height: number) => void;

}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set) => ({
      backgroundImage: null,
      backgroundColor: null,
      dimensions: null,
      imageDimensions: null,
      format: null,
      imageSrc: null,
      processing: false,
      setProcessing: (processing: boolean) => set({ processing }),
      setImageSrc: (imageUrl: string | null) => set({ imageSrc: imageUrl }),
      setFormat: (format: string) => set({ format }),
      setDimensions: (width: number, height: number) =>
        set({ dimensions: { width, height } }),
      setImageDimensions: (width: number, height: number) =>
        set({ imageDimensions: { width, height } }),
      setBackgroundImage: (imageUrl: string | null) =>
        set({ backgroundImage: imageUrl }),
      setBackgroundColor: (color: string | null) =>
        set({ backgroundColor: color }),
    }),
    {
      name: "canvas-storage", // name of item in localStorage
    }
  )
);
