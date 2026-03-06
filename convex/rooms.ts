import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByAccommodation = query({
    args: { accId: v.id("accommodations") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("rooms")
            .filter((q) => q.eq(q.field("accId"), args.accId))
            .collect();
    },
});

export const getAssignmentsForRoom = query({
    args: { roomId: v.id("rooms") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("assignments")
            .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
            .collect();
    },
});

export const assignToRoom = mutation({
    args: {
        tripId: v.id("trips"),
        roomId: v.id("rooms"),
        userId: v.string(), // ID of the member
    },
    handler: async (ctx, args) => {
        // Validate room exists
        const room = await ctx.db.get(args.roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        // Check if user is already assigned to a DIFFERENT room in this trip
        const tripAssignments = await ctx.db
            .query("assignments")
            .withIndex("by_trip_user", (q) =>
                q.eq("tripId", args.tripId).eq("userId", args.userId)
            )
            .collect();

        const existingRoomAssignment = tripAssignments.find(a => a.roomId !== undefined);

        if (existingRoomAssignment) {
            if (existingRoomAssignment.roomId === args.roomId) {
                throw new Error("User is already in this room");
            } else {
                throw new Error("User is already assigned to another room in this trip");
            }
        }

        // Check room capacity
        const currentRoomAssignments = await ctx.db
            .query("assignments")
            .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
            .collect();

        if (currentRoomAssignments.length >= room.maxGuests) {
            throw new Error("Room is at maximum capacity");
        }

        // If the user already has an assignment record (e.g. for transport), update it
        // Otherwise, insert a new assignment
        if (tripAssignments.length > 0) {
            // Pick the first assignment record for this trip/user and add the roomId to it
            const assignmentToUpdate = tripAssignments[0];
            await ctx.db.patch(assignmentToUpdate._id, {
                roomId: args.roomId
            });
            return assignmentToUpdate._id;
        } else {
            return await ctx.db.insert("assignments", {
                tripId: args.tripId,
                userId: args.userId,
                roomId: args.roomId,
            });
        }
    },
});

export const removeFromRoom = mutation({
    args: {
        tripId: v.id("trips"),
        roomId: v.id("rooms"),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const tripAssignments = await ctx.db
            .query("assignments")
            .withIndex("by_trip_user", (q) =>
                q.eq("tripId", args.tripId).eq("userId", args.userId)
            )
            .filter((q) => q.eq(q.field("roomId"), args.roomId))
            .collect();

        if (tripAssignments.length === 0) {
            throw new Error("Assignment not found");
        }

        const assignment = tripAssignments[0];

        // If this assignment is only for a room, we could delete it, 
        // but if they also have a transportId, we should just UNSET the roomId.
        if (assignment.transportId) {
            await ctx.db.patch(assignment._id, { roomId: undefined });
        } else {
            await ctx.db.delete(assignment._id);
        }
    }
});
