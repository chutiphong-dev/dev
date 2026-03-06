"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import { RoomAssignmentGrid } from "@/components/room-assignment-grid";
import { TripMembers } from "@/components/trip-members";
import { TripTransports } from "@/components/trip-transports";
import { TripExpenses } from "@/components/trip-expenses";
import { MyItinerary } from "@/components/my-itinerary";
import { FinancialDashboard } from "@/components/financial-dashboard";

export default function TripDashboard() {
  const params = useParams();
  const tripId = params.tripId as Id<"trips">;

  // We are bypassing proper Auth for the scope of this MVP to ensure it 'just works'
  // Normally Clerk user logic would be here.
  const trip = useQuery(api.trips.getById, { tripId });

  if (trip === undefined) {
    return <div className="p-8"><Skeleton className="h-10 w-1/3 mb-4" /><Skeleton className="h-[400px] w-full" /></div>;
  }

  if (trip === null) {
    return <div className="p-8 text-center text-xl">Trip not found.</div>;
  }

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{trip.title}</h1>
          <p className="text-muted-foreground mt-1">
            {trip.startDate} to {trip.endDate}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="inline-flex h-auto w-max min-w-full justify-start md:grid md:grid-cols-7 md:w-full md:max-w-5xl md:mb-12">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="accommodations">Rooms</TabsTrigger>
            <TabsTrigger value="transports">Transports</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="financials" className="font-semibold text-primary">Financials</TabsTrigger>
            <TabsTrigger value="itinerary" className="font-semibold text-blue-500">My Itinerary</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-6">
          <div className="bg-card text-card-foreground border rounded-lg p-6">
             <h2 className="text-xl font-semibold mb-2">About this Trip</h2>
             <p>{trip.description || "No description provided."}</p>
          </div>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
           <TripMembers tripId={tripId} />
        </TabsContent>

        <TabsContent value="accommodations" className="mt-6">
            <TripAccommodations tripId={tripId} />
        </TabsContent>

        <TabsContent value="transports" className="mt-6">
            <TripTransports tripId={tripId} />
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
            <TripExpenses tripId={tripId} />
        </TabsContent>

        <TabsContent value="financials" className="mt-6">
            <FinancialDashboard tripId={tripId} currentUserRole="sponsor" /> 
        </TabsContent>

        <TabsContent value="itinerary" className="mt-6">
            <MyItinerary tripId={tripId} userId="mock_user_123" />
        </TabsContent>
        
      </Tabs>
    </div>
  );
}

// Inline component for accommodations for speed, usually would be in components/
function TripAccommodations({ tripId }: { tripId: Id<"trips"> }) {
  const accommodations = useQuery(api.accommodations.getByTrip, { tripId });

  if (accommodations === undefined) return <div>Loading...</div>;
  if (accommodations.length === 0) return <div>No accommodations added yet.</div>;

  return (
    <div className="flex flex-col gap-8">
      {accommodations.map(acc => (
        <div key={acc._id} className="border rounded-lg p-6">
           <h3 className="text-2xl font-semibold mb-4">{acc.name} - {acc.type}</h3>
           <RoomAssignmentGrid tripId={tripId} accId={acc._id} />
        </div>
      ))}
    </div>
  )
}
