"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export function TripTransports({ tripId }: { tripId: Id<"trips"> }) {
  const transports = useQuery(api.transports.getByTrip, { tripId });
  const addTransport = useMutation(api.transports.createTransport);
  const removeTransport = useMutation(api.transports.deleteTransport);

  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addTransport({
        tripId,
        type,
        capacity: parseInt(capacity),
        price: parseFloat(price),
      });
      setType("");
      setCapacity("");
      setPrice("");
      toast.success("Transport added");
    } catch (_error) {
      toast.error("Failed to add transport");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (transportId: Id<"transports">) => {
    try {
      await removeTransport({ transportId });
      toast.success("Transport removed");
    } catch (_error) {
       toast.error("Failed to remove transport");
    }
  };

  if (transports === undefined) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-card text-card-foreground border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Transport</h3>
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Input placeholder="E.g. Minivan" value={type} onChange={e => setType(e.target.value)} required />
          </div>
          <div className="space-y-2">
             <Label>Capacity (Seats)</Label>
             <Input type="number" placeholder="10" value={capacity} onChange={e => setCapacity(e.target.value)} required />
          </div>
          <div className="space-y-2">
             <Label>Total Price ($)</Label>
             <Input type="number" step="0.01" placeholder="150" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <Button type="submit" disabled={loading}>Add</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {transports.map(t => (
           <div key={t._id} className="border rounded-lg p-4 flex justify-between items-center bg-card">
              <div>
                 <p className="font-semibold text-lg">{t.type}</p>
                 <p className="text-sm text-muted-foreground">{t.capacity} seats • ${t.price}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleRemove(t._id)}>
                 <Trash className="h-4 w-4" />
              </Button>
           </div>
         ))}
         {transports.length === 0 ? (
         <p className="text-muted-foreground text-center p-8 bg-muted rounded-xl">No rides yet. Better pack comfortable walking shoes! 🥾</p>
      ) : null}
      </div>
    </div>
  );
}
