"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Car, CreditCard, Users, ShieldAlert } from "lucide-react";

export function FinancialDashboard({ tripId, currentUserRole = "sponsor" }: { tripId: Id<"trips">, currentUserRole?: string }) {
  const financials = useQuery(api.financials.getTripFinancialSummary, { tripId });

  if (currentUserRole !== "sponsor" && currentUserRole !== "organizer") {
     return (
       <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
          <ShieldAlert className="h-10 w-10 mb-4 opacity-50" />
          <p>You do not have permission to view the global financial dashboard.</p>
          <p className="text-sm">Only Organizers and Sponsors can view this page.</p>
       </div>
     );
  }

  if (financials === undefined) {
    return <div>Gathering financial data...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${financials.overallTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accommodations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">${financials.totalRoomCost.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transports</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">${financials.totalTransportCost.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Custom Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">${financials.totalCustomExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Per Member Breakdown Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Member Balances</CardTitle>
          </div>
          <CardDescription>Owed amounts automatically split per member based on their room, transport, and custom expenses.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[400px]">
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="text-right">Total Owed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {financials.breakdown.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={3} className="text-center text-muted-foreground">No members in trip</TableCell>
                  </TableRow>
               ) : (
                  financials.breakdown.map((member, i) => (
                    <TableRow key={i}>
                       <TableCell className="font-medium">{member.userId.substring(0,12)}...</TableCell>
                       <TableCell className="capitalize text-muted-foreground text-xs">{member.roles.join(', ')}</TableCell>
                       <TableCell className="text-right font-bold text-destructive">${member.totalOwed.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
               )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
    </div>
  );
}
