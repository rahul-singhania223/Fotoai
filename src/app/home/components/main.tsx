"use client";

import ImageUploader from "@/components/image-uploader";
import { useEffect, useState } from "react";
import { ImagePreview } from "./image-preview";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Download,
  Eraser,
  ImageUpscale,
  Loader2,
  SquareArrowOutUpRight,
} from "lucide-react";
import axios from "axios";
import { useModal } from "@/store/modal.store";
import { useCanvasStore } from "@/store/canvas.store";
import ImageComponent from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/lib/utils";
import { toast } from "sonner";

const tools = [
  {
    name: "Remove Background",
    icon: <Eraser className="w-5 h-5" />,
    process: "remove-bg",
    settings: null,
  },
  {
    name: "Upscale",
    icon: <ImageUpscale className="w-5 h-5" />,
    process: "upscale",
    settings: { factor: 2 },
  },
];

const presets = [
  {
    name: "Amazon",
    logo: "/logos/amazon.svg",
    process: "amazon",
    dimension: { width: 2000, height: 2000 },
    format: "JPEG",
  },
  {
    name: "Ebay",
    logo: "/logos/ebay.svg",
    process: "ebay",
    dimension: { width: 1600, height: 1600 },
    format: "JPEG",
  },
  {
    name: "Flipkart",
    logo: "/logos/flipkart.svg",
    process: "flipkart",
    dimension: { width: 2000, height: 2000 },
    format: "JPEG",
  },
  {
    name: "Instagram",
    logo: "/logos/instagram.svg",
    process: "instagram",
    dimension: { width: 1080, height: 1080 },
    format: "JPEG",
  },
  {
    name: "Etsy",
    logo: "/logos/etsy.svg",
    process: "etsy",
    dimension: { width: 2000, height: 2000 },
    format: "JPEG",
  },
];

export function MainComponent() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processType, setProcessType] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const filePath = searchParams.get("file");

  const { onOpen: openModal } = useModal();

  const {
    backgroundColor,
    setBackgroundColor,
    format,
    setDimensions,
    dimensions,
    setFormat,
    setOriginalDimensions,
    originalDimensions,
  } = useCanvasStore();

  const processImage = async (processType: string, settings?: any) => {
    try {
      setProcessing(true);
      setProcessType(processType);

      const res = await axios.post(`/api/process/${processType}`, {
        image_url: imageUrl,
        settings,
      });

      console.log(res.data);

      const outputPath = res.data.data.output.result_path;
      return router.push(`/home?file=${outputPath}`);
    } catch (err: any) {
      const code = err.response?.data?.code || "INTERNAL_SERVER_ERROR";
      const message = err.response?.data?.message || "Something went wrong!";

      if (code === "INSUFFICIENT_CREDITS") {
        // open payment modal
        openModal("SUBSCRIPTION");
      }
      console.log(err);
      toast.error("Operation Failed!", { description: message });
    } finally {
      setProcessing(false);
    }
  };

  const processForPlatform = async (
    imageUrl: string,
    dimension: { width: number; height: number },
    format: string,
    processType: string
  ) => {
    try {
      setProcessType(processType);
      setProcessing(true);
      setFormat(format);
      setBackgroundColor("#ffff");
      setDimensions(dimension.width, dimension.height);

      const res = await axios.post("/api/process/platform", {
        image_url: imageUrl,
        dimension,
        format,
      });

      const outputPath = res.data.data.output.result_path;
      return router.push(`/home?file=${outputPath}`);
    } catch (err: any) {
      const code = err.response?.data?.code || "INTERNAL_SERVER_ERROR";
      const message = err.response?.data?.message || "Something went wrong!";

      if (code === "INSUFFICIENT_CREDITS") {
        // open payment modal
        openModal("SUBSCRIPTION");
      }

      console.log(err);
      toast.error("Operation Failed!", { description: message });
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    if (processing) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      const link = document.createElement("a");
      const outputFormat = filePath?.split(".")?.pop() || "jpg";
      link.download = "image." + outputFormat;
      link.href = canvas.toDataURL("image/" + outputFormat);
      link.click();
    };
  };

  useEffect(() => {
    if (filePath) {
      const url = getFileUrl(filePath, "Uploads");
      setImageUrl(url);
    }
  }, [filePath]);

  if (!imageUrl || !filePath) return <ImageUploader path="home" />;

  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-5 h-full relative ">
      <ImagePreview
        imageUrl={imageUrl}
        filePath={filePath}
        processing={processing}
      />
      <div className="w-full h-[55%] md:h-full md:w-auto md:flex-[0.5] flex flex-col justify-end-safe md:justify-center">
        <div className="flex flex-wrap gap-4 justify-center ">
          {tools.map((tool, idx) => (
            <button
              key={tool.process}
              disabled={processing}
              onClick={() => processImage(tool.process, tool.settings)}
              className="w-fit rounded-full flex items-center p-2 px-3 text-black/90 gap-2 border transition-all cursor-pointer hover:border-gray-300 hover:border-1 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm"
            >
              <div>
                {processing && processType === tool.process ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  tool.icon
                )}
              </div>
              <span>{tool.name}</span>
            </button>
          ))}

          {presets.map((preset, idx) => (
            <button
              key={preset.process}
              disabled={processing}
              onClick={() =>
                processForPlatform(
                  imageUrl,
                  preset.dimension,
                  preset.format,
                  preset.process
                )
              }
              className="w-fit rounded-full flex items-center p-2 px-3 text-black/90 gap-2 border transition-all cursor-pointer hover:border-gray-300 hover:border-1 hover:scale-105 disabled:cursor-not-allowed disabled:scale-100 shadow-sm"
            >
              {processing && processType === preset.process ? (
                <span>
                  <Loader2 className="animate-spin w-5 h-5" />
                </span>
              ) : (
                <ImageComponent
                  src={preset.logo}
                  alt={preset.name}
                  width={20}
                  height={20}
                />
              )}
              <span>{preset.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-10 md:mt-20">
          <Link
            href={processing ? "#" : `/studio?file=${filePath}`}
            className="flex-1"
          >
            <Button
              disabled={processing}
              variant={"secondary"}
              className="text-lg cursor-pointer w-full h-full"
            >
              Studio <SquareArrowOutUpRight className="!w-5 !h-5" />
            </Button>
          </Link>
          <Button
            disabled={processing}
            onClick={handleDownload}
            className="text-lg cursor-pointer flex-1 h-full"
          >
            Download <Download className="!w-5 !h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
