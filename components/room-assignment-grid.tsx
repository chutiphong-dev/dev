"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, X } from "lucide-react";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

type RoomAssignmentGridProps = {
  tripId: Id<"trips">;
  accId: Id<"accommodations">;
};

export function RoomAssignmentGrid({ tripId, accId }: RoomAssignmentGridProps) {
  const rooms = useQuery(api.rooms.getByAccommodation, { accId });
  const tripMembers = useQuery(api.tripMembers.getByTripId, { tripId });

  // Render loading state while data is fetched
  if (rooms === undefined || tripMembers === undefined) {
    return <div className="text-muted-foreground p-4">Loading rooms...</div>;
  }

  if (rooms.length === 0) {
    return (
        <div className="text-center p-8 bg-muted rounded-xl">
          <p className="text-muted-foreground">No rooms added yet. Are we sleeping on the streets? 🛌</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard
          key={room._id}
          room={room}
          tripId={tripId}
          tripMembers={tripMembers}
        />
      ))}
    </div>
  );
}

type RoomCardProps = {
  room: Doc<"rooms">;
  tripId: Id<"trips">;
  tripMembers: Doc<"members">[];
};

function RoomCard({ room, tripId, tripMembers }: RoomCardProps) {
  const assignments = useQuery(api.rooms.getAssignmentsForRoom, { roomId: room._id });
  const assignMutation = useMutation(api.rooms.assignToRoom);
  const removeMutation = useMutation(api.rooms.removeFromRoom);

  if (assignments === undefined) return <div>Loading...</div>;

  const currentGuests = assignments.length;
  const isFull = currentGuests >= room.maxGuests;

  const handleAssign = async (userId: string) => {
    try {
      await assignMutation({ tripId, roomId: room._id, userId });
      toast.success("User assigned to room");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to assign user");
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await removeMutation({ tripId, roomId: room._id, userId });
      toast.success("User removed from room");
    } catch (_error) {
      toast.error("Failed to remove user");
    }
  };

  // Find remaining unassigned members from this room
  // Using explicit mapping of assigned User IDs for easy lookup
  const assignedUserIds = new Set(assignments.map((a) => a.userId));
  const availableMembers = tripMembers.filter((m) => !assignedUserIds.has(m.userId));

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center text-lg">
          {room.name}
          <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {currentGuests} / {room.maxGuests} guests
          </span>
        </CardTitle>
        <CardDescription>
          ${room.price} / night
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          {assignments.map((assignment) => (
             <div key={assignment._id} className="relative group">
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm transition-transform hover:scale-105">
                     <AvatarImage src={`https://avatar.vercel.sh/${assignment.userId}`} alt={assignment.userId} />
                     <AvatarFallback>{assignment.userId.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <button 
                  onClick={() => handleRemove(assignment.userId)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="h-3 w-3" />
                </button>
             </div>
          ))}

          {!isFull && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none">
                <Plus className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Assign Member</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableMembers.length === 0 ? (
                    <DropdownMenuItem disabled>No members available</DropdownMenuItem>
                ) : (
                    availableMembers.map((member) => (
                        <DropdownMenuItem key={member._id} onClick={() => handleAssign(member.userId)} className="cursor-pointer">
                           User: {member.userId.substring(0, 8)}...
                        </DropdownMenuItem>
                    ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
