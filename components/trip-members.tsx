"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export function TripMembers({ tripId }: { tripId: Id<"trips"> }) {
  const members = useQuery(api.tripMembers.getByTripId, { tripId });
  const addMember = useMutation(api.tripMembers.create);
  const removeMember = useMutation(api.tripMembers.remove);

  const [newUserId, setNewUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserId.trim()) return;

    setLoading(true);
    try {
      await addMember({
        tripId,
        userId: newUserId.trim(),
        roles: ["member"], // default role
      });
      setNewUserId("");
      toast.success("Member added to trip");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: Id<"members">) => {
    try {
      await removeMember({ id });
      toast.success("Member removed from trip");
    } catch (_error) {
      toast.error("Failed to remove member");
    }
  };

  if (members === undefined) return <div>Loading members...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card text-card-foreground border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add Member</h3>
        <form onSubmit={handleAddMember} className="flex gap-4">
          <Input 
            placeholder="User ID (e.g. user_2)" 
            value={newUserId} 
            onChange={(e) => setNewUserId(e.target.value)} 
            className="max-w-xs"
          />
          <Button type="submit" disabled={loading}>
             Add Member
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member._id} className="flex items-center justify-between bg-card text-card-foreground border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                 <AvatarImage src={`https://avatar.vercel.sh/${member.userId}`} alt={member.userId} />
                 <AvatarFallback>{member.userId.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{member.userId}</p>
                <p className="text-xs text-muted-foreground capitalize">{member.roles.join(", ")}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleRemove(member._id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {members.length === 0 && <p className="text-muted-foreground">No members yet. Add some above!</p>}
      </div>
    </div>
  );
}
