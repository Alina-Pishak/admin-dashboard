"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { Button, Input, PasswordInput } from "@/components/ui";

export function LoginForm() {
  const router = useRouter();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/");
  }

  return (
    <form
      className="flex w-full max-w-[335px] flex-col gap-4 lg:w-[323px]"
      onSubmit={onSubmit}
      noValidate
    >
      <Input
        type="email"
        name="email"
        autoComplete="email"
        placeholder="Email address"
        aria-label="Email address"
        required
      />
      <PasswordInput
        name="password"
        autoComplete="current-password"
        placeholder="Password"
        aria-label="Password"
        required
      />
      <Button
        type="submit"
        variant="primary"
        className="mt-2 w-full min-w-0 px-10"
      >
        Log in
      </Button>
    </form>
  );
}
