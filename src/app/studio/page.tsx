"use client";

import ColorPicker from "@/components/color-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { cn, deleteFile, getFileUrl, uploadFileToSupabase } from "@/lib/utils";
import { useCanvasStore } from "@/store/canvas.store";
import axios from "axios";
import {
  Ban,
  Check,
  Crown,
  Download,
  Eraser,
  Expand,
  Flame,
  Frame,
  Image as ImageIcon,
  ImagePlus,
  ImageUpscale,
  Loader2,
  SunMoon,
  X,
} from "lucide-react";
import ImageComponent from "next/image";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BackgroundSettings from "./components/BackgroundSettings";
import { useControllerStore } from "@/store/controller.store";
import UpscaleSettings from "./components/UpscaleSettings";
import LightFixSettings from "./components/LightFixSettings";
import FrameSettings from "./components/FrameSettings";
import { useModal } from "@/store/modal.store";
import ImageUploader from "@/components/image-uploader";
import { useUserStore } from "@/store/user.store";
import { useUser } from "@clerk/nextjs";
import { getUserByUserId } from "@/queries/db";
import Wrapper from "@/components/wrapper";

interface ControllerProps {
  open: boolean;
  processing: boolean;
  processImage: (operation: string, settings?: any) => Promise<any>;
  setOpen: any;
  controller: "BG" | "UPSCALE" | "LIGHTFIX" | "FRAMING";
}

const Controller = ({
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

const FramingControls = ({ setOpen }: { setOpen: any }) => {
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

const LightFixControls = ({
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

const UpscaleControls = ({
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

const BgControls = ({ setOpen }: { setOpen: any }) => {
  const backgroundColors = [
    "#FFFF", // Pure White
    "#F5F7FA", // Soft Light Gray
    "#E3F0FF", // Pale Blue
    "#FFF8E7", // Warm Cream
    "#F6EFEF", // Muted Pinkish White
    "#E8F5E9", // Gentle Mint Green
    "#F0F4C3", // Light Lemon
    "#FFE0F0", // Soft Pink
    "#E0F7FA", // Powder Blue
    "#FFFDE7", // Light Butter Yellow
    "#F3E5F5", // Gentle Mint Green
  ];

  const { setBackgroundColor, setBackgroundImage, backgroundColor } =
    useCanvasStore();

  const [openColorPicker, setOpenColorPicker] = useState(false);

  return (
    <div className="flex items-center gap-4 p-3 overflow-x-auto scrollbar-hide py-5">
      <div
        onClick={() => {
          setBackgroundImage(null);
          setBackgroundColor(null);
        }}
        className="min-w-13 min-h-13 rounded-full bg-slate-50 flex items-center justify-center hover:bg-gray-200"
      >
        <Ban className="w-7 h-7" />
      </div>

      <div
        onClick={() => setOpenColorPicker(true)}
        className="min-w-13 min-h-13 rounded-full bg-gradient-to-r from-red-500 to-indigo-600"
      ></div>

      {openColorPicker && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-background p-3 rounded-lg relative">
            <Button
              variant={"ghost"}
              onClick={() => setOpenColorPicker(false)}
              className="absolute -top-6 -right-5 z-10"
            >
              <X className="w-4 h-4" />
            </Button>
            <ColorPicker
              color={backgroundColor || ""}
              onChange={setBackgroundColor}
            />
          </div>
        </div>
      )}

      {backgroundColors.map((color, index) => (
        <div
          onClick={() => setBackgroundColor(color)}
          key={index}
          className="min-w-13 min-h-13 rounded-full"
          style={{ backgroundColor: color }}
        />
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

// const ImageUploader = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//     }
//   };

//   useEffect(() => {
//     if (file) {
//       const uploadFile = async () => {
//         try {
//           setUploading(true);

//           const { data, error } = await uploadFileToSupabase(
//             file,
//             "Uploads",
//             file.name
//           );

//           if (error) return toast.error(error.message);

//           return redirect(`/studio?file=${data?.path}`);
//         } finally {
//           setUploading(false);
//         }
//       };

//       uploadFile();
//     }
//   }, [file]);

//   return (
//     <div className="flex items-center justify-center h-full">
//       <label
//         htmlFor="file-input"
//         className={cn(
//           "text-center space-y-2 w-full max-w-sm aspect-video justify-center border border-dashed border-gray-400 bg-gray-50 rounded-md flex flex-col items-center p-3 hover:border-blue-500 hover:bg-blue-100",
//           {
//             "cursor-not-allowed": uploading,
//             "!bg-gray-50 !border-gray-400": uploading,
//           }
//         )}
//       >
//         <input
//           disabled={uploading}
//           id="file-input"
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={handleFileChange}
//         />
//         {!uploading ? (
//           <ImagePlus className="w-16 h-16 text-gray-500" />
//         ) : (
//           <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
//         )}
//       </label>
//     </div>
//   );
// };

const EditorCanvas = ({
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

const ToolsList = ({
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

export default function Studio() {
  const searchParams = useSearchParams();
  const filePath = searchParams.get("file");

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [openController, setOpenController] = useState(false);
  const [controller, setController] = useState<
    "BG" | "UPSCALE" | "LIGHTFIX" | "FRAMING"
  >("BG");

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
  const { user: dbUser, setUser } = useUserStore();
  const { user } = useUser();

  const downloadImage = (imageUrl: string) => {
    if (!dimensions || !imageDimensions) return;
    // prepare canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // draw background
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // draw background image
    if (backgroundImage) {
      const image = new Image();
      image.src = backgroundImage;
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    }

    // draw image in center of the canvas
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const x = (canvas.width - imageDimensions.width) / 2;
      const y = (canvas.height - imageDimensions.height) / 2;
      ctx.drawImage(img, x, y, imageDimensions.width, imageDimensions.height);
      const link = document.createElement("a");
      link.download = "image." + format;
      link.href = canvas.toDataURL("image/" + format);
      link.click();
    };
  };

  const handleOpenController = (
    controller: "BG" | "UPSCALE" | "LIGHTFIX" | "FRAMING"
  ) => {
    setOpenController(true);
    setController(controller);
  };

  const processImage = async (operation: string, settings?: any) => {
    if (processing) return;
    try {
      setProcessing(true);
      const res = await axios.post(`/api/process/${operation}`, {
        image_url: imageUrl,
        settings,
      });

      if (!res.data.success) return toast.error("Operation Failed!");

      redirect("/studio?file=" + res.data.data.output.result_path);
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

  const deleteImage = async () => {
    if (filePath) {
      try {
        setDeleting(true);
        const { error } = await deleteFile(filePath, "Uploads");

        if (error) return toast.error(error.message);

        setImageUrl(null);

        return redirect("/home");
      } finally {
        setDeleting(false);
      }
    }
  };

  useEffect(() => {
    if (filePath) {
      if (imageLoadedFromUrl.current) return;
      imageLoadedFromUrl.current = true;
      const fileUrl = getFileUrl(filePath, "Uploads");
      setImageUrl(fileUrl);
      setImageSrc(fileUrl);
    }
  });

  useEffect(() => {
    if (!user) return;

    if (!dbUser) {
      const getDbUser = async () => {
        const res = await getUserByUserId(user.id);
        if (res.error) {
          console.log(res.error);
          return toast.error(res.error.message);
        }

        if (res.data) {
          setUser(res.data);
        }
      };

      getDbUser();
    }
  }, [dbUser, user]);

  return (
    <Wrapper className="max-w-7xl relative">
      <div className="p-3 lg:p-5 space-y-4 lg:space-y-2 flex flex-col h-screen">
        {/* header --> logo --> download button */}
        {imageUrl && (
          <header className="flex items-center justify-between">
            <Button
              disabled={deleting || processing}
              onClick={deleteImage}
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer"
            >
              {deleting ? (
                <Loader2 className="animate-spin text-muted-foreground" />
              ) : (
                <X />
              )}
            </Button>
            <div className="flex items-center gap-6">
              {dbUser && (
                <div className="flex items-center gap-6">
                  {!dbUser.has_subscription && (
                    <Button
                      variant={"secondary"}
                      className="text-orange-500 cursor-pointer hover:bg-orange-500/10"
                    >
                      <Crown /> Go Pro
                    </Button>
                  )}
                  <div className="flex items-center gap-1 font-semibold">
                    <Flame className="text-orange-600 fill-orange-600" />{" "}
                    {dbUser.credits}
                  </div>
                </div>
              )}
              <Button onClick={() => downloadImage(imageUrl)}>
                Download <Download />
              </Button>
            </div>
          </header>
        )}
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
        {/* bottom --> tools --> settings */}
      </div>
    </Wrapper>
  );
}
