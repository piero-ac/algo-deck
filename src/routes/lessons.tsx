import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lessons")({
	component: RouteComponent,
	loader: ({ context }) => context.lessonsQueue,
});

function RouteComponent() {
	const lessons = Route.useLoaderData();
	console.log(lessons.length);
	return (
		<div>
			Hello "/lessons"!
			{lessons.length === 0 && <p>Go to problems page to add lessons</p>}
		</div>
	);
}
