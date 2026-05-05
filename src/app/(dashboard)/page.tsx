import type { Metadata } from "next";
import { DashboardHomeClient } from "./dashboard-home-client";

/**
 * Dashboard — [десктоп 0:76](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=0-76),
 * [планшет 1:187](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=1-187),
 * [мобайл 20:6602](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=20-6602).
 */
export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Огляд магазину: статистика, останні клієнти та рух коштів.",
};

export default function Home() {
  return <DashboardHomeClient />;
}
