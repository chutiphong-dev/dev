import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByTrip = query({
    args: { tripId: v.id("trips") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("expenses")
            .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
            .collect();
    },
});

export const createExpense = mutation({
    args: {
        tripId: v.id("trips"),
        title: v.string(),
        category: v.optional(v.string()),
        amount: v.number(),
        paidById: v.string(),
        splitDetails: v.array(
            v.object({
                userId: v.string(),
                amount: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("expenses", args);
    },
});

export const deleteExpense = mutation({
    args: { expenseId: v.id("expenses") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.expenseId);
    },
});
