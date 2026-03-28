import { v } from "convex/values";
import { authMutation, authQuery } from "./lib/authFunctions";

export const list = authQuery({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("tasks").collect();
	},
});
export const create = authMutation({
	args: {
		text: v.string(),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("tasks", {
			text: args.text,
			isCompleted: false,
		});
	},
});
export const update = authMutation({
	args: {
		id: v.id("tasks"),
		payload: v.object({
			text: v.optional(v.string()),
			isCompleted: v.optional(v.boolean()),
		}),
	},
	handler: async (ctx, args) => {
		return ctx.db.patch(args.id, args.payload);
	},
});
export const remove = authMutation({
	args: {
		id: v.id("tasks"),
	},
	handler: async (ctx, args) => {
		return ctx.db.delete(args.id);
	},
});
