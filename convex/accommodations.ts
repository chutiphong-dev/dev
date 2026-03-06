import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByTrip = query({
    args: { tripId: v.id("trips") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("accommodations")
            .filter((q) => q.eq(q.field("tripId"), args.tripId))
            .collect();
    },
});

export const createAccommodation = mutation({
    args: {
        tripId: v.id("trips"),
        name: v.string(),
        type: v.string(),
        location: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("accommodations", args);
    },
});

export const createRoom = mutation({
    args: {
        accId: v.id("accommodations"),
        name: v.string(),
        maxGuests: v.number(),
        price: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("rooms", args);
    },
});

export const deleteAccommodation = mutation({
    args: { accId: v.id("accommodations") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.accId);
        // Cascading deletes for rooms can be added here
    },
});

export const deleteRoom = mutation({
    args: { roomId: v.id("rooms") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.roomId);
        // Assignments might need cleaning up here too
    },
});
