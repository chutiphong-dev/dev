import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getTripFinancialSummary = query({
    args: {
        tripId: v.id("trips"),
    },
    handler: async (ctx, args) => {
        const rooms = await ctx.db
            .query("rooms")
            .collect();

        // Assuming we need to filter rooms by trip. 
        // Our current 'rooms' table only links to 'accommodations'. 
        // We'll need to fetch accommodations for this trip first.
        const accommodations = await ctx.db
            .query("accommodations")
            .filter((q) => q.eq(q.field("tripId"), args.tripId))
            .collect();

        const accIds = new Set(accommodations.map(a => a._id));
        const tripRooms = rooms.filter(r => accIds.has(r.accId));

        const totalRoomCost = tripRooms.reduce((acc, room) => acc + room.price, 0);

        const transports = await ctx.db
            .query("transports")
            .filter((q) => q.eq(q.field("tripId"), args.tripId))
            .collect();

        const totalTransportCost = transports.reduce((acc, trans) => acc + trans.price + (trans.fuelCost || 0), 0);

        const expenses = await ctx.db
            .query("expenses")
            .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
            .collect();

        const totalCustomExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);

        // Calculate breakdown by member
        const members = await ctx.db
            .query("members")
            .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
            .collect();

        const breakdown = [];

        for (const member of members) {
            // Simplified summary calculation for each user
            // Re-using same logic but grouped:
            const assignments = await ctx.db
                .query("assignments")
                .withIndex("by_trip_user", (q) => q.eq("tripId", args.tripId).eq("userId", member.userId))
                .collect();

            let memberRoomCost = 0;
            let memberTransportCost = 0;
            let memberExpensesCost = 0;

            if (assignments.length > 0) {
                const assignment = assignments[0];
                if (assignment.roomId) {
                    const r = tripRooms.find(r => r._id === assignment.roomId);
                    if (r) {
                        const count = await ctx.db
                            .query("assignments")
                            .withIndex("by_room", (q) => q.eq("roomId", r._id))
                            .collect()
                            .then(lst => lst.length);
                        if (count > 0) memberRoomCost = r.price / count;
                    }
                }

                if (assignment.transportId) {
                    const t = transports.find(t => t._id === assignment.transportId);
                    if (t) {
                        const count = await ctx.db
                            .query("assignments")
                            .withIndex("by_transport", (q) => q.eq("transportId", t._id))
                            .collect()
                            .then(lst => lst.length);
                        if (count > 0) memberTransportCost = t.price / count;
                    }
                }
            }

            for (const expense of expenses) {
                const mySplit = expense.splitDetails.find(s => s.userId === member.userId);
                if (mySplit) {
                    memberExpensesCost += mySplit.amount;
                }
            }

            const totalOwed = memberRoomCost + memberTransportCost + memberExpensesCost;

            breakdown.push({
                userId: member.userId,
                roles: member.roles,
                totalOwed
            });
        }

        return {
            totalRoomCost,
            totalTransportCost,
            totalCustomExpenses,
            overallTotal: totalRoomCost + totalTransportCost + totalCustomExpenses,
            breakdown
        };
    }
});
