"use client";

import ColorPicker from "@/components/color-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
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

export default function LightFixSettings({ imageUrl }: Props) {
  const { controller, processing, setProcessing } = useControllerStore();

  const { onOpen: openModal } = useModal();

  const [alpha, setAlpha] = useState(0.5);

  if (!open || controller !== "LIGHTFIX") return null;

  const fixLighting = async () => {
    try {
      setProcessing(true);
      const res = await processor.lightFix(imageUrl, { alpha });
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
      <div className="">
        <h2 className=" font-medium">Light Fix</h2>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <Slider
          max={1}
          min={0}
          defaultValue={[0.5]}
          step={0.01}
          value={[alpha]}
          onValueChange={(val) => setAlpha(val[0])}
          className="flex-1"
        />
        <Input
          value={alpha}
          onChange={(e) => setAlpha(Number(e.target.value))}
          type="number"
          className="hide-controlls w-24 text-center"
        />
      </div>

      <Button
        disabled={processing}
        onClick={fixLighting}
        className="w-full mt-10 bg-gradient-to-r from-orange-500 via-pink-400 to-pink-500 text-white font-bold py-3 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all"
      >
        {processing ? <Loader2 className="animate-spin" /> : <Sparkles />}
        Fix Lighting
      </Button>
    </div>
  );
}
