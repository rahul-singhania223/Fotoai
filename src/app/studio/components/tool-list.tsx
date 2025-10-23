import { cn } from "@/lib/utils";
import { Eraser, Frame, ImagePlus, ImageUpscale, SunMoon } from "lucide-react";

export const ToolsList = ({
  processImage,
  handleOpenController,
}: {
  processImage: any;
  handleOpenController: any;
}) => {
  return (
    <div className="flex w-full items-center justify-center overflow-x-auto gap-2 p-2 lg:hidden ">
      <div
        onClick={() => processImage("remove-bg")}
        className={cn(
          "text-center font-medium flex flex-col justify-center items-center rounded-md hover:bg-gray-50 p-2 cursor-pointer space-y-1 text-black/90 hover:text-black/100 min-w-24"
        )}
      >
        <Eraser className="w-6 h-6" />
        <span className="text-nowrap">Remove Bg</span>
      </div>
      <div
        onClick={() => handleOpenController("BG")}
        className={cn(
          "text-center font-medium flex flex-col justify-center items-center rounded-md hover:bg-gray-50 p-2 cursor-pointer space-y-1 text-black/90 hover:text-black/100 min-w-24 "
        )}
      >
        <ImagePlus className="w-6 h-6" />
        <span className="text-nowrap">Add Bg</span>
      </div>
      <div
        onClick={() => {
          processImage("upscale", { factor: 2 });
          handleOpenController("UPSCALE");
        }}
        className={cn(
          "text-center font-medium flex flex-col justify-center items-center rounded-md hover:bg-gray-50 p-2 cursor-pointer space-y-1 text-black/90 hover:text-black/100 min-w-24 "
        )}
      >
        <ImageUpscale className="w-6 h-6" />
        <span className="text-nowrap">Upscale</span>
      </div>
      <div
        onClick={() => {
          processImage("light-fix", { alpha: 0.5 });
          handleOpenController("LIGHTFIX");
        }}
        className={cn(
          "text-center font-medium flex flex-col justify-center items-center rounded-md hover:bg-gray-50 p-2 cursor-pointer space-y-1 text-black/90 hover:text-black/100 min-w-24 "
        )}
      >
        <SunMoon className="w-6 h-6" />
        <span className="text-nowrap">Light Fix</span>
      </div>

      <div
        onClick={() => handleOpenController("FRAMING")}
        className={cn(
          "text-center font-medium flex flex-col justify-center items-center rounded-md hover:bg-gray-50 p-2 cursor-pointer space-y-1 text-black/90 hover:text-black/100 min-w-24 "
        )}
      >
        <Frame className="w-6 h-6" />
        <span className="text-nowrap">Framing</span>
      </div>
    </div>
  );
};
