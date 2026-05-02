import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

/** Марк бренду — `public/logo.svg` (E-Pharmacy / Figma). */
export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg",
        className
      )}
      aria-hidden
    >
      <Image
        src="/logo.svg"
        alt=""
        width={44}
        height={44}
        className="size-full object-contain"
        priority
      />
    </div>
  );
}
