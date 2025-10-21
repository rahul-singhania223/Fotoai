import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export default function Wrapper({ children, className }: Props) {
  return (
    <div className={cn("w-full max-w-7xl mx-auto", className)}>{children}</div>
  );
}
