import { createFileRoute } from "@tanstack/react-router";
import { useLessonsQueue } from "@/context/lessonQueue";

export const Route = createFileRoute("/lessons")({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		queue,
		// removeNext,
		// removeFromQueue
	} = useLessonsQueue();

	console.log(queue.length);
	return (
		<div>
			Hello "/lessons"!
			{queue.length === 0 && <p>Go to problems page to add lessons</p>}
			{queue.length > 0 &&
				queue.map((lesson) => {
					return (
						<div key={lesson.problem_number}>
							{lesson.problem_title} {lesson.problem_difficulty}
						</div>
					);
				})}
		</div>
	);
}
