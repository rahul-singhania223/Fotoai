import { useCanvasStore } from "@/store/canvas.store";
import { Check } from "lucide-react";

import ImageComponent from "next/image";

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

export const FramingControls = ({ setOpen }: { setOpen: any }) => {
  const { imageDimensions, setFormat, setDimensions, setImageDimensions } =
    useCanvasStore();

  const applyFrame = async (frame: any) => {
    if (!imageDimensions) return;

    const { width, height, format } = frame;

    let imageWidth = width * 0.9;
    const scale = imageWidth / imageDimensions.width;
    let imageHeight = imageDimensions.height * scale;

    if (imageHeight >= height) {
      imageHeight = height * 0.9;
      const scale = imageHeight / imageDimensions.height;
      imageWidth = imageDimensions.width * scale;
    }

    setDimensions(width, height);
    setImageDimensions(imageWidth, imageHeight);
    setFormat(format);
  };

  return (
    <div className="flex items-center gap-6 p-3 overflow-x-auto scrollbar-hide py-5 !pr-[70px]">
      {frames.map((frame) => (
        <div
          onClick={() => applyFrame(frame)}
          key={frame.name}
          className="text-center space-y-1"
        >
          <div className="min-w-13 min-h-13 rounded-full flex items-center justify-center  shadow cursor-pointer overflow-clip">
            <ImageComponent
              src={frame.logo}
              alt={frame.name}
              width={50}
              height={50}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span>{frame.name}</span>
          </div>
        </div>
      ))}
      <div
        onClick={() => setOpen(false)}
        className="min-w-13 min-h-13 rounded-full bg-white flex items-center justify-center fixed right-3 shadow-md cursor-pointer"
      >
        <Check />
      </div>
    </div>
  );
};
