import type { CustomerRow, OrderRow } from "@/types/table";

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

export const demoCustomers: CustomerRow[] = [
  {
    id: "c1",
    name: "Alex Shatov",
    email: "alexshatov@gmail.com",
    spent: "2,890.66",
  },
  {
    id: "c2",
    name: "Philip Harbach",
    email: "philip.h@gmail.com",
    spent: "2,767.04",
  },
  {
    id: "c3",
    name: "Mirko Fisuk",
    email: "mirkofisuk@gmail.com",
    spent: "2,996.00",
  },
  {
    id: "c4",
    name: "Olga Semklo",
    email: "olga.s@cool.design",
    spent: "1,220.66",
  },
  {
    id: "c5",
    name: "Burak Long",
    email: "longburak@gmail.com",
    spent: "1,890.66",
  },
];
