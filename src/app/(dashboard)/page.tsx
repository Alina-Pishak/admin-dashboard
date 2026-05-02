"use client";
import { useState } from "react";
import { LayoutDashboard, LogOut } from "lucide-react";
import { RecentCustomersTable } from "@/components/dashboard/recent-customers-table";
import {
  ProductFormModal,
  type ProductFormMode,
  type ProductFormValues,
} from "@/components/products/product-form-modal";
import {
  SupplierFormModal,
  type SupplierFormMode,
  type SupplierFormValues,
} from "@/components/suppliers/supplier-form-modal";
import {
  Badge,
  Button,
  DateInput,
  IconButton,
  Input,
  Label,
  PasswordInput,
} from "@/components/ui";

const EDIT_PRODUCT_DEMO: Partial<ProductFormValues> = {
  productInfo: "Moringa",
  category: "medicine",
  stock: "12",
  suppliers: "Square",
  price: "89.66",
};

const EDIT_SUPPLIER_DEMO: Partial<SupplierFormValues> = {
  suppliersInfo: "Global Health Ltd",
  address: "12 Green St, Kyiv",
  company: "PharmaCo",
  deliveryDate: "2026-05-15",
  amount: "1200.00",
  status: "active",
};

export default function Home() {
  const [deliveryDate, setDeliveryDate] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] =
    useState<ProductFormMode>("add");
  const [productModalKey, setProductModalKey] = useState(0);

  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [supplierModalMode, setSupplierModalMode] =
    useState<SupplierFormMode>("add");
  const [supplierModalKey, setSupplierModalKey] = useState(0);

  const openProductModal = (mode: ProductFormMode) => {
    setProductModalMode(mode);
    setProductModalKey((k) => k + 1);
    setProductModalOpen(true);
  };

  const openSupplierModal = (mode: SupplierFormMode) => {
    setSupplierModalMode(mode);
    setSupplierModalKey((k) => k + 1);
    setSupplierModalOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-10 text-foreground">
      <header>
        <p className="text-xs text-muted">UI Kit</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
          E-Pharmacy Admin
        </h1>
      </header>

      <section className="space-y-2">
        <p className="text-xs text-muted">Embedded table (дашборд)</p>
        <RecentCustomersTable />
      </section>

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
        <p className="text-xs text-muted">Date input</p>
        <p className="max-w-xl text-sm text-muted">
          Поле Delivery date з{" "}
          <a
            className="text-primary underline-offset-2 hover:underline"
            href="https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-1187"
            rel="noreferrer"
            target="_blank"
          >
            форми suppliers (92:1187)
          </a>
          : pill + іконка календаря `primary`. Відкритий календар узгоджено з токенами
          UI kit.
        </p>
        <div className="max-w-sm">
          <Label className="mb-1.5 block text-muted" htmlFor="delivery-date">
            Delivery date
          </Label>
          <DateInput
            id="delivery-date"
            aria-label="Delivery date"
            placeholder="Delivery date"
            value={deliveryDate}
            onChange={setDeliveryDate}
          />
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-sm">
        <p className="text-xs text-muted">Product form (modal)</p>
        <p className="max-w-xl text-sm text-muted">
          Десктоп / планшет / мобайл —{" "}
          <a
            className="text-primary underline-offset-2 hover:underline"
            href="https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-804"
            rel="noreferrer"
            target="_blank"
          >
            Figma
          </a>
          . Один компонент для додавання та редагування (інший заголовок і кнопка
          підтвердження).
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={() => openProductModal("add")}
          >
            Add a new product
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => openProductModal("edit")}
          >
            Edit product
          </Button>
        </div>
        <ProductFormModal
          key={productModalKey}
          open={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          mode={productModalMode}
          defaultValues={
            productModalMode === "edit" ? EDIT_PRODUCT_DEMO : undefined
          }
        />
      </section>

      <section className="space-y-3 rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-sm">
        <p className="text-xs text-muted">Supplier form (modal)</p>
        <p className="max-w-xl text-sm text-muted">
          Макети:{" "}
          <a
            className="text-primary underline-offset-2 hover:underline"
            href="https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-1187"
            rel="noreferrer"
            target="_blank"
          >
            desktop
          </a>
          ,{" "}
          <a
            className="text-primary underline-offset-2 hover:underline"
            href="https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-2959"
            rel="noreferrer"
            target="_blank"
          >
            tablet
          </a>
          ,{" "}
          <a
            className="text-primary underline-offset-2 hover:underline"
            href="https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=92-4557"
            rel="noreferrer"
            target="_blank"
          >
            mobile
          </a>
          . Додавання та редагування — один компонент (заголовок і кнопка збереження).
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={() => openSupplierModal("add")}
          >
            Add a new suppliers
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => openSupplierModal("edit")}
          >
            Edit supplier
          </Button>
        </div>
        <SupplierFormModal
          key={supplierModalKey}
          open={supplierModalOpen}
          onClose={() => setSupplierModalOpen(false)}
          mode={supplierModalMode}
          defaultValues={
            supplierModalMode === "edit" ? EDIT_SUPPLIER_DEMO : undefined
          }
        />
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
              ghost — disabled
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
              solid — disabled
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
  );
}
