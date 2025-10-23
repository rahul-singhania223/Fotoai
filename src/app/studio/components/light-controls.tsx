import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const LightFixControls = ({
  setOpen,
  processImage,
}: {
  setOpen: any;
  processImage: any;
}) => {
  const [alpha, setAlpha] = useState(0.5);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      processImage("light-fix", { alpha: alpha });
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [alpha]);

  return (
    <div className="flex items-center gap-4 p-3 overflow-x-auto scrollbar-hide py-5">
      <div className="space-y-2 w-full">
        <Label>Alpha</Label>
        <div className="flex items-center pr-16 gap-4">
          <Slider
            onValueChange={(value) => setAlpha(value[0])}
            value={[alpha]}
            step={0.01}
            defaultValue={[0.5]}
            max={1}
            className=""
          />
          <Input
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            type="number"
            step={0.01}
            className="w-10 hide-controlls text-sm !p-0 text-center"
          />
        </div>
      </div>
      <div
        onClick={() => setOpen(false)}
        className="min-w-13 min-h-13 rounded-full bg-white flex items-center justify-center fixed right-3 shadow-md cursor-pointer"
      >
        <Check />
      </div>
    </div>
  );
};
