"use client";

import { useGetMeQuery } from "@/lib/api";

export default function DashboardPage() {
  const { data: me, isLoading, isError } = useGetMeQuery();

  return (
    <div className="space-y-4">
      <header className="rounded-2xl border border-border bg-card p-5">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your admin area.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5">
        {isLoading && <p className="text-sm text-muted-foreground">Loading profile...</p>}
        {isError && (
          <p className="text-sm text-destructive">
            Failed to load profile from `/auth/me`.
          </p>
        )}
        {!isLoading && !isError && me && (
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Name:</span> {me.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {me.email}
            </p>
            <p>
              <span className="font-medium">Role:</span> {me.role}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
