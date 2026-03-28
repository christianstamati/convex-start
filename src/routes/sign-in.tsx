import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "@/components/SignInForm";

export const Route = createFileRoute("/sign-in")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<SignInForm />
		</div>
	);
}
