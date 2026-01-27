import { createFileRoute } from "@tanstack/react-router";
import { useLessonsQueue } from "@/context/lessonQueue";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";

export const Route = createFileRoute("/lessons")({
	component: RouteComponent,
});

type Rating = "again" | "good" | "easy" | "hard";

function RouteComponent() {
	const {
		queue,
		removeNext,
		// removeFromQueue
	} = useLessonsQueue();
	const submitReview = useSubmitReview();

	const currentLesson = queue[0];

	if (!currentLesson)
		return <h2 className="text-3xl text-center mt-10">No lessons here.....</h2>;

	function handleRate(rating: Rating) {
		submitReview.mutate({
			problemNumber: currentLesson.problem_number,
			rating,
		});
	}

	return (
		<div className="flex flex-col justify-center p-5">
			<div className="text-center">
				<h3>{queue.length} lesson's left</h3>
				<h2 className="text-xl text-bold">
					{currentLesson.problem_number}. {currentLesson.problem_title}
				</h2>
				{submitReview.isSuccess && (
					<p className="text-xl text-green-500">
						Next review on:{" "}
						{new Date(submitReview.data.nextReviewAt).toLocaleDateString(
							"en-US",
						)}
					</p>
				)}
			</div>

			<div className="my-5 mx-auto">
				<ButtonGroup>
					<ButtonGroupText>Ratings</ButtonGroupText>
					{["again", "easy", "good", "hard"].map((r) => (
						<Button
							className="capitalize"
							key={r}
							onClick={() => handleRate(r as Rating)}
							disabled={submitReview.isPending || submitReview.isSuccess}
						>
							{r}
						</Button>
					))}
				</ButtonGroup>
			</div>
			{submitReview.isPending && <p>Submitting review...</p>}
			{submitReview.isError && (
				<p>Error: {(submitReview.error as Error).message}</p>
			)}

			<div className="mx-auto flex gap-2">
				<Button
					onClick={() => {
						submitReview.reset();
						removeNext();
					}}
					disabled={
						queue.length === 0 ||
						!submitReview.isSuccess ||
						submitReview.isPending
					}
					variant="default"
				>
					Next
				</Button>
				<Button
					onClick={() => {
						if (!confirm("Remove this problem from lessons?")) return;
						submitReview.reset();
						removeNext();
					}}
					disabled={submitReview.isPending || submitReview.isSuccess}
					variant="destructive"
				>
					Skip This Lesson
				</Button>
			</div>
		</div>
	);
}
