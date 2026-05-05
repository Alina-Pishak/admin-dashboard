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
  
];
