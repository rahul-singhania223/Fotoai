"use client";

import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/store/canvas.store";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import ImageComponent from "next/image";

export const EditorCanvas = ({
  imageUrl,
  processing,
  className,
}: {
  imageUrl: string;
  processing: boolean;
  className?: string;
}) => {
  const {
    backgroundColor,
    backgroundImage,
    dimensions,
    setDimensions,
    setImageDimensions,
    setImageSrc,
  } = useCanvasStore();
  const capturedInitialCanvasDimensions = useRef<boolean>(false);
  const visibleCanvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // capture initial canvas dimensions

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const { width: imgWidth, height: imgHeight } = img;

      setImageDimensions(imgWidth, imgHeight);

      if (!capturedInitialCanvasDimensions.current) {
        capturedInitialCanvasDimensions.current = true;
        setDimensions(imgWidth, imgHeight);
      }
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!visibleCanvasRef.current) return;
    if (!imageRef.current) return;
    if (!dimensions) return;

    const container = containerRef.current;
    const canvas = visibleCanvasRef.current;
    const image = imageRef.current;

    // initially
    let canvasWidth = dimensions.width;
    let canvasHeight = dimensions.height;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    if (canvasWidth > containerWidth) {
      const scale = containerWidth / canvasWidth;
      canvasWidth *= scale;
      canvasHeight *= scale;
    }

    if (canvasHeight > containerHeight) {
      const scale = containerHeight / canvasHeight;
      canvasWidth *= scale;
      canvasHeight *= scale;
    }

    const imageWidth = canvasWidth * 0.85;
    const imageHeight = canvasHeight * 0.85;

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    image.style.width = `${imageWidth}px`;
    image.style.height = `${imageHeight}px`;
  }, [dimensions]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full relative  flex items-center justify-center",
        className
      )}
    >
      {processing && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/5">
          <Loader2 className="w-7 h-7 text-black animate-spin" />
        </div>
      )}
      <div
        ref={visibleCanvasRef}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: backgroundColor || "",
        }}
        className="w-full h-full flex items-center justify-center "
      >
        <ImageComponent
          ref={imageRef}
          width={1024}
          height={1024}
          src={imageUrl}
          alt="main-image"
          className="w-full object-contain"
        />
      </div>
    </div>
  );
};
