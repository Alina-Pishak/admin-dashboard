"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginUserRequest } from "@/lib/api";
import { setStoredToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { Button, Input, PasswordInput } from "@/components/ui";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setError("root.server", { message: "" });
    setPending(true);

    try {
      const data = await loginUserRequest(values.email, values.password);
      const access =
        typeof data.token === "string"
          ? data.token
          : typeof data.accessToken === "string"
            ? data.accessToken
            : "";
      if (!access) throw new Error("No access token in response");
      setStoredToken(access);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError("root.server", {
        message: err instanceof Error ? err.message : "Login failed",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="flex w-full max-w-[335px] flex-col gap-4 lg:w-[323px]"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Input
        type="email"
        autoComplete="email"
        placeholder="Email address"
        aria-label="Email address"
        {...register("email")}
      />
      {errors.email ? (
        <p className="text-sm text-danger" role="alert">
          {errors.email.message}
        </p>
      ) : null}
      <PasswordInput
        autoComplete="current-password"
        placeholder="Password"
        aria-label="Password"
        {...register("password")}
      />
      {errors.password ? (
        <p className="text-sm text-danger" role="alert">
          {errors.password.message}
        </p>
      ) : null}
      <Button
        type="submit"
        variant="primary"
        className="mt-2 w-full min-w-0 px-10"
        disabled={pending}
      >
        {pending ? "Loading..." : "Log in"}
      </Button>
      {errors.root?.server?.message ? (
        <p className="text-sm text-danger" role="alert">
          {errors.root.server.message}
        </p>
      ) : null}
    </form>
  );
}
