import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onChange: (color: string) => void;
  color: string;
  className?: string;
}

export default function ColorPicker({ onChange, color, className }: Props) {
  return (
    <div className={cn("", className)}>
      <HexColorPicker color={color} onChange={onChange} />
    </div>
  );
}
