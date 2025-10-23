import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

export const UpscaleControls = ({
  processImage,
  processing,
  setOpen,
}: {
  processImage: any;
  processing: boolean;
  setOpen: any;
}) => {
  const [factor, setFactor] = useState(2);

  return (
    <div className="flex items-center gap-4 p-3 overflow-x-auto scrollbar-hide py-5">
      <Button
        disabled={processing}
        onClick={() => {
          processImage("upscale", { factor: 2 });
          setFactor(2);
        }}
        variant={"ghost"}
        className={cn(
          "min-w-13 min-h-13 rounded-full !p-0 flex items-center justify-center text-lg font-medium",
          { "bg-primary text-white": factor === 2 }
        )}
      >
        {processing && factor === 2 ? (
          <Loader2 className="animate-spin" />
        ) : (
          "2X"
        )}
      </Button>
      <Button
        disabled={processing}
        onClick={() => {
          processImage("upscale", { factor: 4 });
          setFactor(4);
        }}
        variant={"ghost"}
        className={cn(
          "min-w-13 min-h-13 rounded-full !p-0 flex items-center justify-center font-medium border",
          {
            "bg-primary text-white hover:bg-primary hover:text-white":
              factor === 4,
          }
        )}
      >
        {processing && factor === 4 ? (
          <Loader2 className="animate-spin" />
        ) : (
          "4X"
        )}
      </Button>
      <div
        onClick={() => setOpen(false)}
        className="min-w-13 min-h-13 rounded-full bg-white flex items-center justify-center fixed right-3 shadow-md cursor-pointer"
      >
        <Check />
      </div>
    </div>
  );
};
