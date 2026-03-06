/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as accommodations from "../accommodations.js";
import type * as expenses from "../expenses.js";
import type * as financials from "../financials.js";
import type * as itinerary from "../itinerary.js";
import type * as rooms from "../rooms.js";
import type * as transports from "../transports.js";
import type * as tripMembers from "../tripMembers.js";
import type * as trips from "../trips.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  accommodations: typeof accommodations;
  expenses: typeof expenses;
  financials: typeof financials;
  itinerary: typeof itinerary;
  rooms: typeof rooms;
  transports: typeof transports;
  tripMembers: typeof tripMembers;
  trips: typeof trips;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
