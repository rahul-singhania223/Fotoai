"use client";

import ColorPicker from "@/components/color-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/store/canvas.store";
import { useControllerStore } from "@/store/controller.store";
import { Ban, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Props {
  className?: string;
  imageUrl: string;
}

const frames: {
  name: string;
  logo: string;
  width: number;
  height: number;
  format: string;
}[] = [
  {
    name: "Amazon",
    logo: "/logos/amazon.svg",
    format: "JPEG",
    width: 2000,
    height: 2000,
  },
  {
    name: "Ebay",
    logo: "/logos/ebay.svg",
    format: "JPEG",
    width: 1600,
    height: 1600,
  },

  {
    name: "Flipkart",
    logo: "/logos/flipkart.svg",
    format: "JPEG",
    width: 2000,
    height: 2000,
  },
  {
    name: "Instagram",
    logo: "/logos/instagram.svg",
    format: "JPEG",
    width: 1080,
    height: 1080,
  },
  {
    name: "Etsy",
    logo: "/logos/etsy.svg",
    format: "JPEG",
    width: 3000,
    height: 2250,
  },
];

export default function FrameSettings({ imageUrl }: Props) {
  const { controller } = useControllerStore();
  const { setDimensions, setFormat, imageDimensions, imageSrc } =
    useCanvasStore();

  if (!open || controller !== "FRAMING") return null;

  console.log(imageSrc);

  return (
    <div className="bg-background p-5 shadow rounded-lg w-full hidden lg:block max-h-[calc(100vh-200px)] overflow-hidden">
      <div className="">
        <h2 className=" font-medium">Framing</h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-300px)] mt-5">
        <div
          onClick={() => {
            imageDimensions &&
              setDimensions(imageDimensions.width, imageDimensions.height);
            setFormat("JPEG");
          }}
          className="flex items-center gap-4 mt-5 hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
        >
          {imageSrc && (
            <Image
              width={100}
              height={100}
              src={imageUrl}
              alt="Original"
              className="w-10 h-10 object-contain"
            />
          )}
          <div className="flex-1">
            <h3 className="font-medium">{"Original"}</h3>
            <p className="text-muted-foreground text-sm">
              {imageDimensions?.width}x{imageDimensions?.height} {"JPEG"}
            </p>
          </div>
        </div>
        {frames.map((frame) => (
          <div
            onClick={() => {
              setDimensions(frame.width, frame.height);
              setFormat(frame.format);
            }}
            key={frame.name}
            className="flex items-center gap-4 mt-5 hover:bg-gray-100 p-2 px-3 rounded-xl cursor-pointer"
          >
            <Image
              width={100}
              height={100}
              src={frame.logo}
              alt={frame.name}
              className="w-10 h-10"
            />
            <div className="flex-1">
              <h3 className="font-medium">{frame.name}</h3>
              <p className="text-muted-foreground text-sm">
                {frame.width}x{frame.height} {frame.format}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
