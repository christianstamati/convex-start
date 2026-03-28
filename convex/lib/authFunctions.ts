import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import {
	customMutation,
	customQuery,
} from "convex-helpers/server/customFunctions";
import type { Id } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";

/** Thrown when `authQuery` / `authMutation` run without a signed-in user. */
export const AUTH_UNAUTHENTICATED = "UNAUTHENTICATED" as const;

export type AuthUserCtx = {
	userId: Id<"users">;
};

/**
 * Use for auth-domain queries that require a signed-in user. Handlers receive
 * `ctx.userId`. Unauthenticated clients get a {@link ConvexError} with
 * {@link AUTH_UNAUTHENTICATED}.
 *
 * Prefer plain `query` when the client should receive `null` while logged out
 * (e.g. `users.me`, `sessions.current`).
 */
export const authQuery = customQuery(query, {
	args: {},
	input: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (userId === null) {
			throw new ConvexError(AUTH_UNAUTHENTICATED);
		}
		return { ctx: { userId }, args: {} };
	},
});

/**
 * Same as {@link authQuery} for mutations (e.g. profile / account updates).
 */
export const authMutation = customMutation(mutation, {
	args: {},
	input: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (userId === null) {
			throw new ConvexError(AUTH_UNAUTHENTICATED);
		}
		return { ctx: { userId }, args: {} };
	},
});
