import { Button } from "@/components/ui/button";
import { deleteFile } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ImageComponent from "next/image";

interface ImagePreviewProps {
  processing: boolean;
  imageUrl: string;
  filePath: string;
}

export const ImagePreview = ({
  processing,
  imageUrl,
  filePath,
}: ImagePreviewProps) => {
  const [deleting, setDeleting] = useState(false);

  const deleteImage = async () => {
    if (!filePath) return;
    try {
      setDeleting(true);
      const { error } = await deleteFile(filePath, "Uploads");
      if (error) return toast.error(error.message);
      return redirect("/home");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
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
    </>
  );
};
