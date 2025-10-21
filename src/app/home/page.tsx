"use client";

import ImageUploader from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import { deleteFile, getFileUrl } from "@/lib/utils";
import { useCanvasStore } from "@/store/canvas.store";
import { useModal } from "@/store/modal.store";
import { ClerkLoaded, ClerkLoading, useAuth, UserButton } from "@clerk/nextjs";
import axios from "axios";
import { get } from "http";
import {
  Download,
  Eraser,
  Flame,
  Frame,
  ImageUpscale,
  Loader2,
  SquareArrowOutUpRight,
  SunMoon,
  X,
} from "lucide-react";
import ImageComponent from "next/image";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Header from "./components/header";
import Wrapper from "@/components/wrapper";

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

export default function Homepage() {
  const params = useSearchParams();
  const filePath = params.get("file");

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processType, setProcessType] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    backgroundColor,
    setBackgroundColor,
    format,
    setDimensions,
    dimensions,
    setFormat,
  } = useCanvasStore();

  const { onOpen: openModal } = useModal();

  useEffect(() => {
    if (filePath) {
      const fileUrl = getFileUrl(filePath, "Uploads");
      setImageUrl(fileUrl);
    }
  }, [filePath]);

  const deleteImage = async () => {
    if (!filePath) return;
    try {
      setDeleting(true);
      const { error } = await deleteFile(filePath, "Uploads");
      if (error) return toast.error(error.message);
      setImageUrl(null);
      return redirect("/home");
    } finally {
      setDeleting(false);
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
      return redirect(`/home?file=${outputPath}`);
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

  const processImage = async (processType: string, settings?: any) => {
    try {
      setProcessing(true);
      setProcessType(processType);

      const res = await axios.post(`/api/process/${processType}`, {
        image_url: imageUrl,
        settings,
      });

      const outputPath = res.data.data.output.result_path;
      return redirect(`/home?file=${outputPath}`);
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

  const handleDownload = async () => {
    if (!imageUrl) return;
    if (!filePath) return;
    if (processing || !dimensions) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // add background
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const image = new Image();
    image.src = imageUrl;
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const imgW = dimensions.width * 0.8;
      const scale = imgW / image.width;
      const imgH = image.height * scale;

      const x = (canvas.width - imgW) / 2;
      const y = (canvas.height - imgH) / 2;

      ctx.drawImage(image, x, y, imgW, imgH);
      const link = document.createElement("a");
      link.download = "image." + format;
      link.href = canvas.toDataURL("image/" + format);
      link.click();
    };
  };

  return (
    <Wrapper>
      <div className="p-3 space-y-10">
        <Header />
        <main className="space-y-8 w-full h-[calc(100vh-150px)]">
          {imageUrl ? (
            <div className="w-full flex flex-col lg:flex-row items-center gap-5 h-full relative ">
              <Button
                disabled={processing || deleting}
                onClick={deleteImage}
                variant="ghost"
                size="icon"
                className="rounded-full cursor-pointer absolute top-0 left-0 z-10"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </Button>
              <div className="w-full h-[35%] flex items-center justify-center p-3 md:p-5 md:h-full md:w-auto md:flex-[0.5] relative">
                {processing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
                  </div>
                )}
                <ImageComponent
                  src={imageUrl}
                  alt="uploaded image"
                  width={500}
                  height={500}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
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
          ) : (
            <ImageUploader path="home" />
          )}
        </main>
      </div>
    </Wrapper>
  );
}
