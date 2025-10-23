"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "./Header";
import { redirect, useSearchParams } from "next/navigation";
import { cn, getFileUrl } from "@/lib/utils";
import { useCanvasStore } from "@/store/canvas.store";
import FrameSettings from "./FrameSettings";
import LightFixSettings from "./LightFixSettings";
import UpscaleSettings from "./UpscaleSettings";
import BackgroundSettings from "./BackgroundSettings";
import { EditorCanvas } from "./canvas";
import { Frame, ImageIcon, ImageUpscale, SunMoon } from "lucide-react";
import { useControllerStore } from "@/store/controller.store";
import ImageUploader from "@/components/image-uploader";
import { Controller } from "./controller";
import { ToolsList } from "./tool-list";
import axios from "axios";
import { toast } from "sonner";
import { useModal } from "@/store/modal.store";

export const Main = () => {
  const searchParams = useSearchParams();
  const filePath = searchParams.get("file");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [openController, setOpenController] = useState(false);
  const [controller, setController] = useState<
    "BG" | "UPSCALE" | "LIGHTFIX" | "FRAMING"
  >("BG");

  const [processing, setProcessing] = useState(false);

  const imageLoadedFromUrl = useRef(false);

  const {
    dimensions,
    imageDimensions,
    format,
    backgroundColor,
    backgroundImage,
    setImageSrc,
  } = useCanvasStore();

  const {
    controller: desktopController,
    setController: setDesktopController,
    setProcessing: setControllerProcessing,
  } = useControllerStore();

  const { onOpen: openModal } = useModal();

  const processImage = async (operation: string, settings?: any) => {
    if (processing) return;
    try {
      setProcessing(true);
      const res = await axios.post(`/api/process/${operation}`, {
        image_url: imageUrl,
        settings,
      });

      if (!res.data.success) return toast.error("Operation Failed!");

      return redirect("/studio?file=" + res.data.data.output.result_path);
    } catch (err: any) {
      const code = err.response.data.code || "INTERNAL_SERVER_ERROR";
      const message = err.response.data.message || "Something went wrong!";

      if (code === "INSUFFICIENT_CREDITS") {
        // open payment modal
        openModal("SUBSCRIPTION");
      }

      console.log(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenController = (
    controller: "BG" | "UPSCALE" | "LIGHTFIX" | "FRAMING"
  ) => {
    setOpenController(true);
    setController(controller);
  };

  useEffect(() => {
    if (filePath) {
      if (imageLoadedFromUrl.current) return;
      imageLoadedFromUrl.current = true;
      const fileUrl = getFileUrl(filePath, "Uploads");
      setImageUrl(fileUrl);
      setImageSrc(fileUrl);
    }
  }, [filePath]);

  return (
    <>
      <Header processing={processing} filePath={filePath} imageUrl={imageUrl} />
      <main className="flex-1 overflow-hidden py-5 lg:py-0 pb-[150px] lg:pb-0">
        {/* main --> canvas --> upload button */}
        {!imageUrl && <ImageUploader />}

        {imageUrl && (
          <div className="lg:flex lg:items-start lg:justify-between h-full relative">
            <div className="h-fit lg:flex flex-col items-center gap-5 border shadow rounded-lg p-2 text-sm fixed top-1/2 -translate-y-1/2 z-10 bg-background hidden">
              <div
                onClick={() => {
                  setDesktopController("BG");
                }}
                className={cn(
                  "text-center font-medium flex flex-col justify-center items-center rounded-md hover:bg-gray-50 p-2 cursor-pointer space-y-1 text-black/90 hover:text-black/100 min-w-24"
                )}
              >
                <ImageIcon className="w-5 h-5" />
                <span className="text-nowrap ">Background</span>
              </div>

              <div
                onClick={() => {
                  setDesktopController("UPSCALE");
                }}
                className={cn(
                  "text-center font-medium flex flex-col justify-center items-center rounded-md hover:bg-gray-50 p-2 cursor-pointer space-y-1 text-black/90 hover:text-black/100 min-w-24 "
                )}
              >
                <ImageUpscale className="w-5 h-5" />
                <span className="text-nowrap">Upscale</span>
              </div>

              <div
                onClick={() => {
                  setDesktopController("LIGHTFIX");
                }}
                className={cn(
                  "text-center font-medium flex flex-col justify-center items-center rounded-md hover:bg-gray-50 p-2 cursor-pointer space-y-1 text-black/90 hover:text-black/100 min-w-24 "
                )}
              >
                <SunMoon className="w-5 h-5" />
                <span className="text-nowrap">Light Fix</span>
              </div>

              <div
                onClick={() => setDesktopController("FRAMING")}
                className={cn(
                  "text-center font-medium flex flex-col justify-center items-center rounded-md hover:bg-gray-50 p-2 cursor-pointer space-y-1 text-black/90 hover:text-black/100 min-w-24 "
                )}
              >
                <Frame className="w-5 h-5" />
                <span className="text-nowrap">Framing</span>
              </div>
            </div>
            <EditorCanvas
              className="lg:flex-1"
              imageUrl={imageUrl}
              processing={processing}
            />
            <div className="h-fit min-w-[180px] max-w-[280px] w-full absolute top-1/2 -translate-y-1/2 right-0">
              <BackgroundSettings imageUrl={imageUrl} className="" />
              <UpscaleSettings imageUrl={imageUrl} />
              <LightFixSettings imageUrl={imageUrl} />
              <FrameSettings imageUrl={imageUrl} className="" />
            </div>
          </div>
        )}
      </main>
      <div className="flex items-center justify-between fixed bottom-0 left-0 right-0">
        {imageUrl && (
          <>
            <ToolsList
              processImage={processImage}
              handleOpenController={handleOpenController}
            />
            <Controller
              controller={controller}
              open={openController}
              setOpen={setOpenController}
              processImage={processImage}
              processing={processing}
            />
          </>
        )}
      </div>
    </>
  );
};
