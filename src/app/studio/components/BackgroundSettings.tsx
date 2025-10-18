"use client";

import ColorPicker from "@/components/color-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { processor } from "@/queries/process";
import { useCanvasStore } from "@/store/canvas.store";
import { useControllerStore } from "@/store/controller.store";
import { useModal } from "@/store/modal.store";
import { Ban, Loader2, Sparkles, X } from "lucide-react";
import { useState } from "react";

interface Props {
  className?: string;
  imageUrl: string;
}

const backgroundColors = [
  "#FFFF", // Pure White
  "#F5F7FA", // Soft Light Gray
  "#E3F0FF", // Pale Blue
  "#FFF8E7", // Warm Cream
  "#F6EFEF", // Muted Pinkish White
  "#E8F5E9", // Gentle Mint Green
  "#F0F4C3", // Light Lemon
  "#FFE0F0", // Soft Pink
  "#E0F7FA", // Powder Blue
  "#FFFDE7", // Light Butter Yellow
  "#F3E5F5", // Gentle Mint Green
];

export default function BackgroundSettings({ imageUrl }: Props) {
  const { backgroundColor, setBackgroundColor, processing, setProcessing } =
    useCanvasStore();

  const { controller } = useControllerStore();
  const { onOpen: openModal } = useModal();

  const [openColorPicker, setOpenColorPicker] = useState(false);

  if (!open || controller !== "BG") return null;

  const removeBackground = async () => {
    try {
      setProcessing(true);
      const res = await processor.removeBackground(imageUrl);
      return res;
    } catch (err: any) {
      const code = err.response.data.code || "INTERNAL_SERVER_ERROR";
      const message = err.response.data.message || "Something went wrong!";

      if (code === "INSUFFICIENT_CREDITS") {
        // open payment modal
        openModal("SUBSCRIPTION");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-background p-5 shadow rounded-lg w-full hidden lg:block">
      {openColorPicker && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-background p-3 rounded-lg relative">
            <Button
              variant={"ghost"}
              onClick={() => setOpenColorPicker(false)}
              className="absolute -top-6 -right-5 z-10"
            >
              <X className="w-4 h-4" />
            </Button>
            <ColorPicker
              color={backgroundColor || ""}
              onChange={setBackgroundColor}
            />
          </div>
        </div>
      )}
      <div className="">
        <h2 className=" font-medium">Background</h2>
      </div>
      <div className="flex flex-wrap gap-2 mt-10">
        <button
          disabled={processing}
          onClick={() => {
            setBackgroundColor(null);
          }}
          style={{ backgroundImage: "url('/images/transparent.png')" }}
          className="w-9 h-9 rounded-full shadow-xs cursor-pointer bg-center bg-cover"
        />
        {backgroundColors.map((color) => (
          <button
            disabled={processing}
            onClick={() => setBackgroundColor(color)}
            key={color}
            style={{ backgroundColor: color }}
            className={cn(
              "w-8 h-8 rounded-full shadow-xs cursor-pointer border border-transparent hover:border-muted-foreground",
              {
                "border-muted-foreground": color === backgroundColor,
              }
            )}
          />
        ))}
      </div>

      <div className="flex items-center gap-4 mt-10">
        <button
          disabled={processing}
          onClick={() => setOpenColorPicker(true)}
          className="w-8 h-8 bg-gradient-to-r from-red-500 to-indigo-600 rounded-full cursor-pointer"
        />
        <Input
          disabled={processing}
          value={backgroundColor || ""}
          onChange={(e) => setBackgroundColor(e.target.value)}
          type="text"
          placeholder="#ffff"
          className="flex-1"
        />
      </div>

      <Button
        disabled={processing}
        onClick={removeBackground}
        className="w-full mt-10 bg-gradient-to-r from-orange-500 via-pink-400 to-pink-500 text-white font-bold py-3 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all"
      >
        {processing ? <Loader2 className="animate-spin" /> : <Sparkles />}
        Remove Background
      </Button>
    </div>
  );
}
