import { useSubmitReview } from "@/hooks/useSubmitReview";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { type Rating } from "@/hooks/useSubmitReview";

type ReviewItem = {
	userId: number;
	problemNumber: number;
	problem: {
		title: string;
	}
};

type ReviewsApiResponse = ReviewItem[];

export const Route = createFileRoute("/_authenticated/reviews")({
	component: RouteComponent,
	loader: async (): Promise<ReviewsApiResponse> => {
		// TODO: change 1 to appropriate userId when auth is added
		const countResult = await fetch("/api/reviews/count/1");
		if (!countResult.ok) {
			throw new Error("Could not fetch review count");
		}
		const reviewsCount: number = await countResult.json();

		if (reviewsCount === 0) {
			throw redirect({ to: "/" });
		}

		// TODO: change 1 to appropriate userId when auth is added
		const reviewsDataResult = await fetch("/api/reviews/due/1");
		if (!reviewsDataResult.ok) {
			throw new Error("Could not fetch reviews");
		}
		const reviewsData: ReviewsApiResponse = await reviewsDataResult.json();

		return reviewsData;
	},
});

function RouteComponent() {
	const reviews = Route.useLoaderData();
	const [queue, setQueue] = useState<ReviewItem[]>(() => reviews);
	const submitReview = useSubmitReview();
	const current = queue[0];

	if (!current) {
		return <div>All reviews completed 🎉</div>;
	}

	if (!reviews) {
		return <div>No reviews due today 🎉</div>;
	}

	function handleRate(rating: Rating) {
		// TODO: change 1 to appropriate userId when auth is added
		submitReview.mutate(
			{
				problemNumber: current.problemNumber,
				rating,
				userId: 1,
			},
			{
				onSuccess: () => {
					setQueue((q) => q.slice(1));
					submitReview.reset();
				},
			},
		)
	}

	return (
		<div className="flex flex-col justify-center p-5">
			<div className="text-center">
				<h3>{queue.length} review(s) left</h3>
				<h2 className="text-xl font-bold">
					{current.problemNumber}. {current.problem.title}
				</h2>
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
							disabled={submitReview.isPending}
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
		</div>
	)
}
