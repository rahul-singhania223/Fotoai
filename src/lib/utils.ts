import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function uploadFileToSupabase(
  file: File,
  bucket: string,
  path: string
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) return { data: null, message: "Upload failed!", error };

  return { data, message: "Upload success!", error: null };
}

export function getFileUrl(path: string, bucket: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
}

export async function deleteFile(path: string, bucket: string) {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) return { data: null, message: "Delete failed!", error };

  return { data: null, message: "Delete success!", error: null };
}


export function isValidUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}