import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

/**
 * Сторінка входу — [десктоп 82:503](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=82-503),
 * [планшет 92:1412](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-1412),
 * [мобайл 92:3297](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-3297).
 */
export const metadata: Metadata = {
  title: "Вхід",
  description: "Увійдіть до панелі керування E-Pharmacy.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-full flex-1 overflow-hidden bg-surface-page">
      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[1280px] flex-col px-5 pb-16 pt-6 sm:px-8 md:px-10 lg:min-h-screen lg:px-[100px] lg:pb-24 lg:pt-7">
        <Link
          href="/"
          className="mb-[148px] md:mb-[148px] lg:mb-10  flex w-fit shrink-0 items-center gap-3.5 lg:mb-14"
        >
          <Logo className="size-11 rounded-lg" />
          <span className="text-xl font-semibold tracking-tight text-foreground">
            E-Pharmacy
          </span>
        </Link>

        <div className="flex flex-1 flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
          <section className="flex flex-1 flex-col gap-6 lg:max-w-[640px] lg:gap-8">
            <div className="flex flex-row items-start justify-between gap-4">
              <h1
                className={cn(
                  "max-w-[335px] font-semibold text-foreground sm:max-w-none",
                  "text-[28px] leading-[34px] md:max-w-[640px] md:text-[54px] md:leading-[60px]",
                )}
              >
                Your medication, delivered Say goodbye to all{" "}
                <span className="text-primary">your healthcare</span> worries
                with us
              </h1>
            </div>
          </section>

          <section className="flex shrink-0 justify-start lg:justify-end">
            <LoginForm />
          </section>
        </div>
      </div>
    </div>
  );
}
