"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UpscaleControls } from "./upscale-controls";
import { BgControls } from "./bg-controls";
import { LightFixControls } from "./light-controls";
import { FramingControls } from "./framing-controls";

interface ControllerProps {
  open: boolean;
  processing: boolean;
  processImage: (operation: string, settings?: any) => Promise<any>;
  setOpen: any;
  controller: "BG" | "UPSCALE" | "LIGHTFIX" | "FRAMING";
}

export const Controller = ({
  open,
  processing,
  processImage,
  setOpen,
  controller,
}: ControllerProps) => {
  return (
    <Sheet open={open}>
      <SheetContent
        side="bottom"
        closeButton={false}
        hideOverlay={true}
        className=""
      >
        <SheetHeader className="hidden">
          <SheetTitle>Bottom Sheet</SheetTitle>
        </SheetHeader>
        {controller === "UPSCALE" && (
          <UpscaleControls
            processImage={processImage}
            processing={processing}
            setOpen={setOpen}
          />
        )}

        {controller === "BG" && <BgControls setOpen={setOpen} />}
        {controller === "LIGHTFIX" && (
          <LightFixControls processImage={processImage} setOpen={setOpen} />
        )}
        {controller === "FRAMING" && <FramingControls setOpen={setOpen} />}
      </SheetContent>
    </Sheet>
  );
};
