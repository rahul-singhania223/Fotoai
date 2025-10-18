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

export default function UpscaleSettings({ imageUrl }: Props) {
  const [factor, setFactor] = useState(2);

  const { controller, processing, setProcessing } = useControllerStore();

  const { onOpen: openModal } = useModal();

  if (!open || controller !== "UPSCALE") return null;

  const upscale = async () => {
    try {
      setProcessing(true);
      const res = await processor.upscale(imageUrl, { factor });
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
        <h2 className=" font-medium">Upscale</h2>
      </div>
      <div className="flex items-center gap-2 mt-10">
        <Button
          variant={"outline"}
          onClick={() => setFactor(2)}
          className={cn("flex-1", {
            "bg-primary text-white hover:bg-primary/90 hover:text-white":
              factor === 2,
          })}
        >
          2X
        </Button>
        <Button
          variant={"outline"}
          onClick={() => setFactor(4)}
          className={cn("flex-1", {
            "bg-primary text-white hover:bg-primary/90 hover:text-white":
              factor === 4,
          })}
        >
          4X
        </Button>
      </div>

      <Button
        disabled={processing}
        onClick={upscale}
        className="w-full mt-10 bg-gradient-to-r from-orange-500 via-pink-400 to-pink-500 text-white font-bold py-3 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all"
      >
        {processing ? <Loader2 className="animate-spin" /> : <Sparkles />}
        Upscale
      </Button>
    </div>
  );
}
