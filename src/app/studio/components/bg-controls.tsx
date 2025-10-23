import ColorPicker from "@/components/color-picker";
import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/store/canvas.store";
import { Ban, Check, X } from "lucide-react";
import { useState } from "react";

export const BgControls = ({ setOpen }: { setOpen: any }) => {
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

  const { setBackgroundColor, setBackgroundImage, backgroundColor } =
    useCanvasStore();

  const [openColorPicker, setOpenColorPicker] = useState(false);

  return (
    <div className="flex items-center gap-4 p-3 overflow-x-auto scrollbar-hide py-5">
      <div
        onClick={() => {
          setBackgroundImage(null);
          setBackgroundColor(null);
        }}
        className="min-w-13 min-h-13 rounded-full bg-slate-50 flex items-center justify-center hover:bg-gray-200"
      >
        <Ban className="w-7 h-7" />
      </div>

      <div
        onClick={() => setOpenColorPicker(true)}
        className="min-w-13 min-h-13 rounded-full bg-gradient-to-r from-red-500 to-indigo-600"
      ></div>

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

      {backgroundColors.map((color, index) => (
        <div
          onClick={() => setBackgroundColor(color)}
          key={index}
          className="min-w-13 min-h-13 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
      <div
        onClick={() => setOpen(false)}
        className="min-w-13 min-h-13 rounded-full bg-white flex items-center justify-center fixed right-3 shadow-md cursor-pointer"
      >
        <Check />
      </div>
    </div>
  );
};