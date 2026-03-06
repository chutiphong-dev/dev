import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getMyItinerary = query({
    args: {
        tripId: v.id("trips"),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Get assignments for this user
        const assignments = await ctx.db
            .query("assignments")
            .withIndex("by_trip_user", (q) => q.eq("tripId", args.tripId).eq("userId", args.userId))
            .collect();

        let myRoom = null;
        let myRoomCost = 0;
        let myTransport = null;
        let myTransportCost = 0;

        const assignment = assignments[0];

        // 2. Compute Room Cost
        if (assignment?.roomId) {
            const room = await ctx.db.get(assignment.roomId);
            if (room) {
                myRoom = room;
                // How many people are in this room?
                const roomAssignments = await ctx.db
                    .query("assignments")
                    .withIndex("by_room", (q) => q.eq("roomId", assignment.roomId as Id<"rooms">))
                    .collect();

                if (roomAssignments.length > 0) {
                    myRoomCost = room.price / roomAssignments.length;
                }
            }
        }

        // 3. Compute Transport Cost
        if (assignment?.transportId) {
            const transport = await ctx.db.get(assignment.transportId);
            if (transport) {
                myTransport = transport;
                // How many people are in this transport?
                const transportAssignments = await ctx.db
                    .query("assignments")
                    .withIndex("by_transport", (q) => q.eq("transportId", assignment.transportId as Id<"transports">))
                    .collect();

                if (transportAssignments.length > 0) {
                    myTransportCost = transport.price / transportAssignments.length;
                }
            }
        }

        // 4. Compute Custom Expenses Cost
        const allExpenses = await ctx.db
            .query("expenses")
            .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
            .collect();

        let myExpensesCost = 0;
        const myExpensesList = [];

        for (const expense of allExpenses) {
            const mySplit = expense.splitDetails.find(s => s.userId === args.userId);
            if (mySplit) {
                myExpensesCost += mySplit.amount;
                myExpensesList.push({
                    title: expense.title,
                    category: expense.category,
                    amountOwed: mySplit.amount,
                    paidBy: expense.paidById
                });
            }
        }

        const totalOwed = myRoomCost + myTransportCost + myExpensesCost;

        return {
            myRoom,
            myRoomCost,
            myTransport,
            myTransportCost,
            myExpensesList,
            myExpensesCost,
            totalOwed
        };
    }
});
