import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLessonsQueue } from "@/context/lessonQueue";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { Button } from "@/components/ui/button";
import { type Rating } from "@/hooks/useSubmitReview";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/lessons")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isLoaded, isSignedIn, user } = useUser();
	const { queue, removeNext } = useLessonsQueue();
	const submitReview = useSubmitReview();
	const navigate = useNavigate();

	const currentLesson = queue[0];

	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			navigate({ to: "/login" });
		}
	}, [isLoaded, isSignedIn, navigate]);

	if (!currentLesson)
		return <h2 className="text-3xl text-center mt-10">No lessons here.....</h2>;

	async function handleRate(rating: Rating) {
		const token = (await window.Clerk?.session?.getToken()) as string;
		submitReview.mutate({
			problemNumber: currentLesson.number,
			rating,
			userId: user?.id!,
			token,
		});
	}

	return (
		<div className="flex flex-col justify-center p-5">
			<div className="text-center">
				<h3>{queue.length} lesson's left</h3>
				<h2 className="text-xl text-bold">
					{currentLesson.number}. {currentLesson.title}
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
					{[
						["again", "1"],
						["easy", "4"],
						["good", "3"],
						["hard", "2"],
					].map((r) => (
						<Button
							className="capitalize"
							key={r[0]}
							onClick={() => handleRate(r[1] as Rating)}
							disabled={submitReview.isPending || submitReview.isSuccess}
						>
							{r[0]}
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
