import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

/** Марк бренду — спрощений зелений хрест як у Figma «Medicine store». */
export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white",
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-[22px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4v16M4 12h16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
