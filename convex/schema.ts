import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    trips: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        startDate: v.string(),
        endDate: v.string(),
        organizerId: v.string(), // ID from Clerk Auth
    }),

    members: defineTable({
        tripId: v.id("trips"),
        userId: v.string(), // Clerk user ID
        roles: v.array(v.union(v.literal("organizer"), v.literal("member"), v.literal("sponsor"))),
    }).index("by_trip", ["tripId"]),

    accommodations: defineTable({
        tripId: v.id("trips"),
        name: v.string(),
        type: v.string(), // Hotel, Resort, etc.
        location: v.optional(v.string()),
    }),

    rooms: defineTable({
        accId: v.id("accommodations"),
        name: v.string(),
        maxGuests: v.number(),
        price: v.number(),
    }),

    transports: defineTable({
        tripId: v.id("trips"),
        type: v.string(),
        capacity: v.number(),
        price: v.number(),
        fuelCost: v.optional(v.number()), // optional or required depending on transport type
    }),

    // linking users to rooms and transport seats.
    assignments: defineTable({
        tripId: v.id("trips"),
        userId: v.string(),
        roomId: v.optional(v.id("rooms")),
        transportId: v.optional(v.id("transports")),
    }).index("by_trip_user", ["tripId", "userId"])
        .index("by_room", ["roomId"])
        .index("by_transport", ["transportId"]),

    expenses: defineTable({
        tripId: v.id("trips"),
        title: v.string(),
        category: v.optional(v.string()), // added category
        amount: v.number(),
        paidById: v.string(), // userId of who paid
        splitDetails: v.array(v.object({
            userId: v.string(),
            amount: v.number(),
        }))
    }).index("by_trip", ["tripId"]),
});