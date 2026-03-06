"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function Home() {
  const trips = useQuery(api.trips.getAll);

  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex justify-between items-center mt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trip Dashboard</h1>
          <p className="text-muted-foreground">Manage your trips, accommodations, and more from here.</p>
        </div>
        <Button asChild>
          <Link href="/trips/new">
            <Plus className="mr-2 h-4 w-4" /> New Trip
          </Link>
        </Button>
      </div>

      {trips === undefined ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <Skeleton className="h-[125px] w-full rounded-xl" />
        </div>
      ) : trips.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No trips yet</CardTitle>
            <CardDescription>Create your first trip to get started.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link href={`/trips/${trip._id}`} key={trip._id} className="block transition-transform hover:-translate-y-1">
              <Card>
                <CardHeader>
                  <CardTitle>{trip.title}</CardTitle>
                  <CardDescription>
                    {trip.startDate} - {trip.endDate}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{trip.description || "No description provided."}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
