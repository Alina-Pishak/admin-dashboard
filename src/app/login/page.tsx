"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorText("");

    try {
      const response = await login({ email, password }).unwrap();
      localStorage.setItem("accessToken", response.token);
      router.push("/dashboard");
    } catch {
      setErrorText("Login failed. Check credentials or API connection.");
    }
  };

  return (
    <main className="app-container flex min-h-screen items-center justify-center py-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xs">
        <h1 className="text-2xl font-bold tracking-tight">Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to access the admin dashboard.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {errorText ? <p className="text-sm text-destructive">{errorText}</p> : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
