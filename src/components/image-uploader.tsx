"use client";

import { cn, uploadFileToSupabase } from "@/lib/utils";
import { ImagePlus, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface Props {
  className?: string;
  path?: string;
}

export default function ImageUploader({ path, className }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const uploadContainerRef = useRef<HTMLLabelElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  useEffect(() => {
    const reset = () => setIsDragging(false);
    window.addEventListener("dragend", reset);
    window.addEventListener("dragleave", reset);
    return () => {
      window.removeEventListener("dragend", reset);
      window.removeEventListener("dragleave", reset);
    };
  }, []);

  useEffect(() => {
    if (file) {
      const uploadFile = async () => {
        try {
          setUploading(true);

          const { data, error } = await uploadFileToSupabase(
            file,
            "Uploads",
            file.name
          );

          if (error) return toast.error(error.message);

          return redirect(`/${path || "studio"}?file=${data?.path}`);
        } finally {
          setUploading(false);
        }
      };

      uploadFile();
    }
  }, [file]);

  return (
    <div className="flex items-center justify-center h-full">
      <label
        ref={uploadContainerRef}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        htmlFor="file-input"
        className={cn(
          "text-center space-y-2 w-full lg:max-w-[50%] aspect-[9/10] lg:aspect-video justify-center border border-dashed border-gray-400 bg-gray-50 rounded-md flex flex-col items-center p-3 hover:border-blue-500 hover:bg-blue-100",
          {
            "cursor-not-allowed": uploading,
            "!bg-gray-50 !border-gray-400": uploading,
            "border-blue-500 bg-blue-100": isDragging,
          }
        )}
      >
        <input
          disabled={uploading}
          id="file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {!uploading ? (
          <ImagePlus className="w-16 h-16 text-gray-500" />
        ) : (
          <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
        )}

        <div className="mt-5 space-y-4">
          <p className="text-muted-foreground">Drop your image here</p>

          <Button disabled={uploading}>Choose From Files</Button>
        </div>
      </label>
    </div>
  );
}
