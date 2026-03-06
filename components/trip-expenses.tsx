"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function TripExpenses({ tripId }: { tripId: Id<"trips"> }) {
  const expenses = useQuery(api.expenses.getByTrip, { tripId });

  if (expenses === undefined) return <div>Loading expenses...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card text-card-foreground border rounded-lg p-6 flex items-center justify-between">
         <h3 className="text-lg font-semibold text-muted-foreground">Expense splitting UI is coming soon!</h3>
         <p className="text-sm italic text-muted-foreground">This tab will feature a complex form</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {expenses.map(e => (
            <div key={e._id} className="border p-4 rounded-lg bg-card">
               <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{e.title}</h4>
                  <span className="font-bold">${e.amount}</span>
               </div>
               <p className="text-xs text-muted-foreground">Paid by: {e.paidById}</p>
            </div>
         ))}
         {expenses.length === 0 && <p className="text-muted-foreground pl-2">No expenses recorded yet.</p>}
      </div>
    </div>
  );
}
