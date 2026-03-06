import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByTrip = query({
    args: { tripId: v.id("trips") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("transports")
            .filter((q) => q.eq(q.field("tripId"), args.tripId))
            .collect();
    },
});

export const createTransport = mutation({
    args: {
        tripId: v.id("trips"),
        type: v.string(),
        capacity: v.number(),
        price: v.number(),
        fuelCost: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("transports", args);
    },
});

export const deleteTransport = mutation({
    args: { transportId: v.id("transports") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.transportId);
    },
});
