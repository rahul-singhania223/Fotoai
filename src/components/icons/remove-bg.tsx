import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export default function RemoveBg({ className }: Props) {
  return (
    <svg
      className={cn("", className)}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <rect x="4" y="8" width="24" height="16" rx="3" fill="#E0E0E0" />
      <rect x="7" y="11" width="18" height="10" rx="2" fill="#B3C6E7" />
      <rect
        x="20"
        y="18"
        width="7"
        height="4"
        rx="1"
        transform="rotate(45 20 18)"
        fill="#FFB4B4"
        stroke="#D32F2F"
        strokeWidth="1"
      />
      <rect
        x="22"
        y="19"
        width="2"
        height="1"
        rx="0.5"
        transform="rotate(45 22 19)"
        fill="#FFF"
      />
      <line
        x1="9"
        y1="13"
        x2="23"
        y2="21"
        stroke="#D32F2F"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
