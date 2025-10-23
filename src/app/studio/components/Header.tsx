"use client";

import { Button } from "@/components/ui/button";
import { deleteFile } from "@/lib/utils";
import { getUserByUserId } from "@/queries/db";
import { useCanvasStore } from "@/store/canvas.store";
import { useModal } from "@/store/modal.store";
import { useUserStore } from "@/store/user.store";
import { useUser } from "@clerk/nextjs";
import { Crown, Download, Flame, Loader2, X } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  imageUrl: string | null;
  processing: boolean;
  filePath: string | null;
}

export const Header = ({ imageUrl, processing, filePath }: Props) => {
  const [deleting, setDeleting] = useState(false);

  const { user } = useUser();
  const { user: dbUser, setUser: setDbUser } = useUserStore();
  const { onOpen: openModal } = useModal();

  const {
    dimensions,
    imageDimensions,
    format,
    backgroundColor,
    backgroundImage,
    setImageSrc,
  } = useCanvasStore();

  const deleteImage = async () => {
    if (filePath) {
      try {
        setDeleting(true);
        const { error } = await deleteFile(filePath, "Uploads");

        if (error) return toast.error(error.message);

        return redirect("/home");
      } finally {
        setDeleting(false);
      }
    }
  };

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

  useEffect(() => {
    if (!user) return;

    if (!dbUser) {
      const getDbUser = async () => {
        const res = await getUserByUserId(user.id);
        if (res.error) {
          console.log(res.error);
          return toast.error("Couldn't get user data!");
        }

        if (res.data) {
          setDbUser(res.data);
        }
      };

      getDbUser();
    }
  }, [dbUser, user]);

  if (!imageUrl) return null;

  return (
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
                onClick={() => openModal("SUBSCRIPTION")}
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
  );
};
