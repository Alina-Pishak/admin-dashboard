import type {
  CustomerRow,
  OrderRow,
  ProductRow,
  SupplierRow,
} from "@/types/table";

export const demoOrders: OrderRow[] = [
  {
    id: "1",
    userName: "Alex Shatov",
    address: "Mripur-1",
    products: 12,
    orderDate: "July 31, 2023",
    price: "890.66",
    status: "completed",
  },
  {
    id: "2",
    userName: "Philip Harbach",
    address: "Dhonmondi",
    products: 19,
    orderDate: "July 31, 2023",
    price: "340.16",
    status: "confirmed",
  },
  {
    id: "3",
    userName: "Mirko Fisuk",
    address: "Uttara-6",
    products: 9,
    orderDate: "July 31, 2023",
    price: "530.76",
    status: "pending",
  },
  {
    id: "4",
    userName: "Olga Semklo",
    address: "Gulshan-1",
    products: 14,
    orderDate: "July 31, 2023",
    price: "280.57",
    status: "cancelled",
  },
  {
    id: "5",
    userName: "Burak Long",
    address: "Mirpur-12",
    products: 10,
    orderDate: "July 31, 2023",
    price: "567.34",
    status: "processing",
  },
  ...Array.from({ length: 20 }, (_, i): OrderRow => {
    const statuses: OrderRow["status"][] = [
      "completed",
      "confirmed",
      "pending",
      "cancelled",
      "processing",
    ];
    return {
      id: `gen-${i}`,
      userName: `User ${i + 6}`,
      address: `Area-${i % 7}`,
      products: (i % 15) + 1,
      orderDate: "Aug 1, 2023",
      price: `${(100 + i * 13).toFixed(2)}`,
      status: statuses[i % 5]!,
    };
  }),
];

const productCategories = [
  "medicine",
  "heart",
  "head",
  "hand",
  "leg",
] as const;

export const demoProducts: ProductRow[] = [
  {
    id: "1",
    productInfo: "Moringa",
    category: "medicine",
    stock: "12",
    suppliers: "Square",
    price: "89.66",
  },
  {
    id: "2",
    productInfo: "Antibiotic 250 mg",
    category: "heart",
    stock: "19",
    suppliers: "Acme",
    price: "34.16",
  },
  {
    id: "3",
    productInfo: "Headache Relief",
    category: "head",
    stock: "09",
    suppliers: "Beximco",
    price: "53.76",
  },
  {
    id: "4",
    productInfo: "Pharmacy",
    category: "hand",
    stock: "14",
    suppliers: "ACI",
    price: "28.57",
  },
  {
    id: "5",
    productInfo: "Magnesium",
    category: "leg",
    stock: "10",
    suppliers: "Uniliver",
    price: "56.34",
  },
  ...Array.from({ length: 20 }, (_, i): ProductRow => {
    const cat = productCategories[i % 5]!;
    return {
      id: `p-${i + 6}`,
      productInfo: `Product ${i + 6}`,
      category: cat,
      stock: String((i % 20) + 1).padStart(2, "0"),
      suppliers: `Vendor ${(i % 5) + 1}`,
      price: `${(10 + i * 7.25).toFixed(2)}`,
    };
  }),
];

export const demoSuppliers: SupplierRow[] = [
  {
    id: "1",
    suppliersInfo: "Alex Shatov",
    address: "Mripur-1",
    company: "Square",
    deliveryDate: "2023-08-01",
    amount: "6952.53",
    status: "active",
  },
  {
    id: "2",
    suppliersInfo: "Philip",
    address: "Dhonmondi",
    company: "Acme",
    deliveryDate: "2023-08-01",
    amount: "8527.58",
    status: "active",
  },
  {
    id: "3",
    suppliersInfo: "Mirko",
    address: "Uttara-6",
    company: "Beximco",
    deliveryDate: "2023-08-01",
    amount: "2698.50",
    status: "active",
  },
  {
    id: "4",
    suppliersInfo: "Olga",
    address: "Gulshan-1",
    company: "ACI",
    deliveryDate: "2023-08-01",
    amount: "9852.64",
    status: "active",
  },
  {
    id: "5",
    suppliersInfo: "Burak",
    address: "Mirpur-12",
    company: "Uniliver",
    deliveryDate: "2023-08-01",
    amount: "1736.90",
    status: "deactive",
  },
  ...Array.from({ length: 20 }, (_, i): SupplierRow => {
    const n = i + 6;
    return {
      id: `s-${n}`,
      suppliersInfo: `Supplier ${n}`,
      address: `Block ${(i % 9) + 1}`,
      company: `Company ${(i % 4) + 1}`,
      deliveryDate: "2023-08-15",
      amount: `${(1200 + i * 211).toFixed(2)}`,
      status: i % 7 === 0 ? "deactive" : "active",
    };
  }),
];

export const demoCustomers: CustomerRow[] = [
  {
    id: "c1",
    name: "Alex Shatov",
    email: "alexshatov@gmail.com",
    spent: "2,890.66",
    address: "Mripur-1",
    phone: "+8801736985253",
    registerDate: "2023-08-01",
  },
  {
    id: "c2",
    name: "Philip Harbach",
    email: "philip.h@gmail.com",
    spent: "2,767.04",
    address: "Dhonmondi",
    phone: "+8801636985275",
    registerDate: "2023-08-01",
  },
  {
    id: "c3",
    name: "Mirko Fisuk",
    email: "mirkofisuk@gmail.com",
    spent: "2,996.00",
    address: "Uttara-6",
    phone: "+8801336985214",
    registerDate: "2023-08-01",
  },
  {
    id: "c4",
    name: "Olga Semklo",
    email: "olga.s@cool.design",
    spent: "1,220.66",
    address: "Gulshan-1",
    phone: "+8801736985264",
    registerDate: "2023-08-01",
  },
  {
    id: "c5",
    name: "Burak Long",
    email: "longburak@gmail.com",
    spent: "1,890.66",
    address: "Mirpur-12",
    phone: "+8801736984514",
    registerDate: "2023-08-01",
  },
  ...Array.from({ length: 20 }, (_, i): CustomerRow => {
    const n = i + 6;
    return {
      id: `c-${n}`,
      name: `Customer ${n}`,
      email: `user${n}@example.com`,
      spent: `${(1000 + n * 120).toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      address: `Area ${(i % 8) + 1}`,
      phone: `+88017${String(3000000 + n).slice(-7)}`,
      registerDate: "2023-09-15",
    };
  }),
];
