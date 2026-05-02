export type LedgerKind = "income" | "expense" | "error";

export type LedgerRow = {
  id: string;
  kind: LedgerKind;
  description: string;
  /** Відображення суми зі знаком */
  amount: string;
  strikethrough?: boolean;
};

/** Рядки Income/Expenses — [Dashboard 0:76](https://www.figma.com/design/RRrBndFgQLZ96QH3awLwCI/Admin-dashboard--Copy-?node-id=0-76) */
export const demoLedgerToday: LedgerRow[] = [
  {
    id: "1",
    kind: "expense",
    description: "Qonto billing",
    amount: "-49.88",
  },
  {
    id: "2",
    kind: "income",
    description: "Cruip.com Market Ltd 70 Wilson St London",
    amount: "+249.88",
  },
  {
    id: "3",
    kind: "income",
    description: "Notion Labs Inc",
    amount: "+99.99",
  },
  {
    id: "4",
    kind: "income",
    description: "Market Cap Ltd",
    amount: "+1,200.88",
  },
  {
    id: "5",
    kind: "error",
    description: "App.com Market Ltd 70 Wilson St London",
    amount: "+99.99",
    strikethrough: true,
  },
  {
    id: "6",
    kind: "expense",
    description: "App.com Market Ltd 70 Wilson St London",
    amount: "-49.88",
  },
];
