import { authQuery } from "./lib/authFunctions";

export const me = authQuery({
	args: {},
	handler: async (ctx) => ctx.db.get(ctx.userId),
});
