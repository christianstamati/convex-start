import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";

export const useTasks = () => {
	return useQuery(convexQuery(api.tasks.list));
};

export const useCreateTask = () => {
	return useMutation({
		mutationFn: useConvexMutation(api.tasks.create),
	});
};

export const useUpdateTask = () => {
	return useMutation({
		mutationFn: useConvexMutation(api.tasks.update),
	});
};

export const useRemoveTask = () => {
	return useMutation({
		mutationFn: useConvexMutation(api.tasks.remove),
	});
};

export const useRemoveAllTasks = () => {
	const removeAllTasks = useConvexMutation(api.tasks.removeAll);
	return useMutation({
		mutationFn: () => removeAllTasks(),
	});
};
