import { v } from "convex/values";
import { authMutation, authQuery } from "./lib/authFunctions";

export const list = authQuery({
	args: {},
	handler: async (ctx) => {
		return await ctx.db
			.query("tasks")
			.withIndex("userId", (q) => q.eq("userId", ctx.userId))
			.collect();
	},
});
export const create = authMutation({
	args: {
		text: v.string(),
	},
	handler: async (ctx, args) => {
		return ctx.db.insert("tasks", {
			text: args.text,
			userId: ctx.userId,
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
export const removeAll = authMutation({
	args: {},
	handler: async (ctx) => {
		const tasks = await ctx.db
			.query("tasks")
			.withIndex("userId", (q) => q.eq("userId", ctx.userId))
			.collect();

		await Promise.all(tasks.map((task) => ctx.db.delete(task._id)));
	},
});
