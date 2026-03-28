import { createFileRoute, Link } from "@tanstack/react-router";
import type { Doc } from "convex/_generated/dataModel";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Trash } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { SignOut } from "@/components/SignOut";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useCreateTask,
	useRemoveAllTasks,
	useRemoveTask,
	useTasks,
	useUpdateTask,
} from "@/hooks/tasks";
import { useMe } from "@/hooks/users";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({ component: App });

function App() {
	return (
		<div className="mx-auto flex max-w-md flex-col gap-4 p-4">
			<AuthLoading>Loading...</AuthLoading>
			<Unauthenticated>
				<div className="flex flex-col gap-2">
					<p>Unauthenticated</p>
					<Link to="/sign-in">Sign in</Link>
				</div>
			</Unauthenticated>
			<Authenticated>
				<UserInfo />
				<TaskList />
			</Authenticated>
		</div>
	);
}

function UserInfo() {
	const { data: user, isLoading } = useMe();

	if (isLoading) {
		return (
			<Card>
				<CardHeader className="space-y-2">
					<Skeleton className="h-7 w-[min(100%,14rem)]" />
					<Skeleton className="h-4 w-[min(100%,12rem)]" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-9 w-24" />
				</CardContent>
			</Card>
		);
	}

	if (!user) {
		return <div>User not found</div>;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Welcome back, {user.name}</CardTitle>
				<CardDescription>{user.email}</CardDescription>
			</CardHeader>
			<CardContent>
				<SignOut />
			</CardContent>
		</Card>
	);
}

function TaskList() {
	const { data: tasks } = useTasks();
	const { mutate: createTask } = useCreateTask();
	const { mutate: updateTask } = useUpdateTask();
	const { mutate: removeTask } = useRemoveTask();
	const { mutate: removeAllTasks } = useRemoveAllTasks();

	const [draft, setDraft] = useState("");

	function handleAdd(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const text = draft.trim();
		if (!text) return;
		void createTask({ text });
		setDraft("");
	}
	return (
		<Card>
			<CardHeader className="flex items-center justify-between">
				<CardTitle>Tasks</CardTitle>
				<Button
					variant="destructive"
					size={"icon"}
					onClick={() => removeAllTasks()}
				>
					<Trash />
				</Button>
			</CardHeader>
			<CardContent className="space-y-4">
				<form onSubmit={handleAdd} className="flex gap-2">
					<Input
						className="flex-1"
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						placeholder="New task"
						aria-label="New task"
					/>
					<Button type="submit">Add</Button>
				</form>
				<ul className="space-y-2">
					{tasks?.map((task) => (
						<TaskItem
							key={task._id}
							task={task}
							onUpdate={(payload) => updateTask({ id: task._id, payload })}
							onRemove={() => removeTask({ id: task._id })}
						/>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}

function TaskItem({
	task,
	onUpdate,
	onRemove,
}: {
	task: Doc<"tasks">;
	onUpdate: (payload: { text?: string; isCompleted?: boolean }) => void;
	onRemove: () => void;
}) {
	return (
		<li className="flex items-center gap-2">
			<Checkbox
				checked={task.isCompleted}
				onCheckedChange={(checked) =>
					onUpdate({ isCompleted: checked === true })
				}
				aria-label="Completed"
			/>
			<Input
				className={cn(
					"min-w-0 flex-1",
					task.isCompleted && "line-through opacity-70",
				)}
				defaultValue={task.text}
				onBlur={(e) => {
					const next = e.target.value.trim();
					if (!next || next === task.text) return;
					onUpdate({ text: next });
				}}
			/>
			<Button type="button" variant="destructive" size="sm" onClick={onRemove}>
				Delete
			</Button>
		</li>
	);
}
