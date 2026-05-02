import { LayoutDashboard, LogOut } from "lucide-react";
import {
  Badge,
  Button,
  IconButton,
  Input,
  Label,
  PasswordInput,
} from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-full bg-surface-page px-6 py-10 text-foreground">
      <div className="mx-auto max-w-3xl space-y-10">
        <header>
          <p className="text-xs text-muted">UI Kit</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            E-Pharmacy Admin
          </h1>
        </header>

        <section className="space-y-3 rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-sm">
          <p className="text-xs text-muted">Button</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Add</Button>
            <Button variant="primary" disabled>
              Add
            </Button>
            <Button variant="outline">Cancel</Button>
            <Button variant="outline" disabled>
              Cancel
            </Button>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-sm">
          <p className="text-xs text-muted">Input</p>
          <div className="flex max-w-sm flex-col gap-4">
            <div>
              <Label className="mb-1.5 block" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
              />
            </div>
            <div>
              <Label className="mb-1.5 block" htmlFor="password">
                Password
              </Label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="Password"
              />
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-sm">
          <p className="text-xs text-muted">IconButton</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-wide text-muted">
                ghost — навігація (Menu)
              </span>
              <IconButton variant="ghost" aria-label="Меню">
                <LayoutDashboard className="size-5" strokeWidth={1.75} />
              </IconButton>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-wide text-muted">
                ghost — навігація (Menu)
              </span>
              <IconButton variant="ghost" disabled aria-label="Меню">
                <LayoutDashboard className="size-5" strokeWidth={1.75} />
              </IconButton>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-wide text-muted">
                solid — вихід (Logout)
              </span>
              <IconButton variant="solid" aria-label="Вийти">
                <LogOut className="size-5" strokeWidth={1.75} />
              </IconButton>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-wide text-muted">
                solid — вихід (Logout)
              </span>
              <IconButton disabled variant="solid" aria-label="Вийти">
                <LogOut className="size-5" strokeWidth={1.75} />
              </IconButton>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-sm">
          <p className="text-xs text-muted">Badge</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="completed">Completed</Badge>
            <Badge variant="confirmed">Confirmed</Badge>
            <Badge variant="pending">Pending</Badge>
            <Badge variant="cancelled">Cancelled</Badge>
            <Badge variant="processing">Processing</Badge>
          </div>
        </section>
      </div>
    </div>
  );
}
