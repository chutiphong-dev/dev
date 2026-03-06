import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("trips").collect();
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        startDate: v.string(),
        endDate: v.string(),
        organizerId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("trips", args);
    },
});

export const getById = query({
    args: { tripId: v.id("trips") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.tripId);
    },
});

export const remove = mutation({
    args: { tripId: v.id("trips") },
    handler: async (ctx, args) => {
        // In a real app, also delete related members, rooms, etc.
        await ctx.db.delete(args.tripId);
    },
});
