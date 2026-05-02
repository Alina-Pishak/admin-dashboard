import type { LucideIcon } from "lucide-react";
import {
  FlaskConical,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const dashboardNav: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/products", label: "Products", icon: FlaskConical },
  { href: "/suppliers", label: "Suppliers", icon: Package },
  { href: "/customers", label: "Customers", icon: Users },
];
