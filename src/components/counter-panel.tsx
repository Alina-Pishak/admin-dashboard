"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  decrement,
  increment,
  incrementByAmount,
  reset,
} from "@/lib/features/counter/counterSlice";

export function CounterPanel() {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.counter.value);

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Redux Counter Demo</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Значення зі store: <span className="font-semibold">{value}</span>
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => dispatch(decrement())} variant="outline">
          -1
        </Button>
        <Button onClick={() => dispatch(increment())}>+1</Button>
        <Button onClick={() => dispatch(incrementByAmount(5))} variant="secondary">
          +5
        </Button>
        <Button onClick={() => dispatch(reset())} variant="ghost">
          Reset
        </Button>
      </div>
    </div>
  );
}
