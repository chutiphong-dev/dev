"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Car, CreditCard, DollarSign } from "lucide-react";

export function MyItinerary({ tripId, userId }: { tripId: Id<"trips">, userId: string }) {
  const itinerary = useQuery(api.itinerary.getMyItinerary, { tripId, userId });

  if (itinerary === undefined) {
    return <div>Loading your itinerary...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Room Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Where you&apos;re crashing</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {itinerary.myRoom ? (
              <>
                <div className="text-2xl font-bold">{itinerary.myRoom.name}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your Share: ${itinerary.myRoomCost.toFixed(2)}
                </p>
              </>
            ) : (
               <div className="text-sm text-muted-foreground mt-2">No room assigned.</div>
            )}
          </CardContent>
        </Card>

        {/* Transport Card */}
        <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Chariot Awaits</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {itinerary.myTransport ? (
              <>
                <div className="text-2xl font-bold">{itinerary.myTransport.type}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your Share: ${itinerary.myTransportCost.toFixed(2)}
                </p>
              </>
            ) : (
               <div className="text-sm text-muted-foreground mt-2">No transport assigned.</div>
            )}
          </CardContent>
        </Card>

        {/* Total Owed Card */}
        <Card className="bg-primary text-primary-foreground">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium">Damage Done</CardTitle>
             <DollarSign className="h-4 w-4" />
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-bold">${itinerary.totalOwed.toFixed(2)}</div>
             <p className="text-xs text-primary-foreground/80 mt-1">
               Payable to trip organizer
             </p>
           </CardContent>
        </Card>
      </div>

      <Card>
         <CardHeader>
           <CardTitle>Other Assigned Expenses</CardTitle>
           <CardDescription>Costs split with you automatically</CardDescription>
         </CardHeader>
         <CardContent>
            {itinerary.myExpensesList.length > 0 ? (
               <div className="space-y-4">
                 {itinerary.myExpensesList.map((exp, i) => (
                    <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                       <div>
                          <p className="font-medium">{exp.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{exp.category || "General"} • Paid by {exp.paidBy.substring(0,8)}</p>
                       </div>
                       <div className="font-semibold text-destructive">
                          + ${exp.amountOwed.toFixed(2)}
                       </div>
                    </div>
                 ))}
               </div>
            ) : (
               <p className="text-sm text-muted-foreground">No additional expenses assigned to you yet.</p>
            )}
         </CardContent>
      </Card>

    </div>
  );
}
