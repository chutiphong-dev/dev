import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all members for a specific trip
export const getByTripId = query({
    args: { tripId: v.id("trips") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("members")
            .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
            .collect();
    },
});

// Get a specific trip member by their ID
export const getById = query({
    args: { id: v.id("members") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Add a new member to a trip
export const create = mutation({
    args: {
        tripId: v.id("trips"),
        userId: v.string(),
        roles: v.array(
            v.union(v.literal("organizer"), v.literal("member"), v.literal("sponsor"))
        ),
    },
    handler: async (ctx, args) => {
        // Check if the user is already a member of this trip to prevent duplicates
        const existingMembers = await ctx.db
            .query("members")
            .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();

        if (existingMembers.length > 0) {
            throw new Error("User is already a member of this trip");
        }

        return await ctx.db.insert("members", {
            tripId: args.tripId,
            userId: args.userId,
            roles: args.roles,
        });
    },
});

// Update a member's roles
export const updateRoles = mutation({
    args: {
        id: v.id("members"),
        roles: v.array(
            v.union(v.literal("organizer"), v.literal("member"), v.literal("sponsor"))
        ),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { roles: args.roles });
    },
});

// Remove a member from a trip
export const remove = mutation({
    args: { id: v.id("members") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
