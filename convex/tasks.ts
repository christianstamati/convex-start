import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect()
  },
})
export const create = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: false,
    })
  },
})
export const update = mutation({
  args: {
    id: v.id("tasks"),
    payload: v.object({
      text: v.optional(v.string()),
      isCompleted: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    return ctx.db.patch(args.id, args.payload)
  },
})
export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    return ctx.db.delete(args.id)
  },
})
