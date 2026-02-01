import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";

export const Route = createFileRoute("/(auth)/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col items-center mt-5 gap-3">
			<h1 className="font-bold text-7xl">AlgoDeck</h1>
			<SignIn />;
		</div>
	);
}
