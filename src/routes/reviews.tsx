import { useSubmitReview } from "@/hooks/useSubmitReview";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";

type Rating = "again" | "good" | "easy" | "hard";

type ReviewsCountApiResponse = {
	review_count: number;
}[];

type ReviewItem = {
	problemNumber: number;
	title: string;
	slug: string;
	nextReviewAt: string;
	lastReview: string;
};

type ReviewsData = {
	date: string;
	count: number;
	reviews: ReviewItem[];
};

type ReviewsApiResponse = {
	date: string;
	count: number;
	reviews: {
		problem_number: number;
		next_review_at: string;
		last_review: string;
		problem_title: string;
		problem_slug: string;
	}[];
};

export const Route = createFileRoute("/reviews")({
	component: RouteComponent,
	loader: async (): Promise<ReviewsData> => {
		const reviewsCountResult = await fetch("/api/reviews/count");
		if (!reviewsCountResult.ok) {
			throw new Error("Could not fetch review count");
		}
		const reviewsCount: ReviewsCountApiResponse =
			await reviewsCountResult.json();

		if (reviewsCount[0].review_count === 0) {
			throw redirect({ to: "/" });
		}

		const reviewsDataResult = await fetch("/api/reviews/today");
		if (!reviewsDataResult.ok) {
			throw new Error("Could not fetch reviews");
		}
		const reviewsData: ReviewsApiResponse = await reviewsDataResult.json();

		return {
			date: reviewsData.date,
			count: reviewsData.count,
			reviews: reviewsData.reviews.map((r) => ({
				problemNumber: r.problem_number,
				title: r.problem_title,
				slug: r.problem_slug,
				nextReviewAt: r.next_review_at,
				lastReview: r.last_review,
			})),
		};
	},
});

function RouteComponent() {
	const data = Route.useLoaderData();
	const [queue, setQueue] = useState<ReviewItem[]>(() => data.reviews);
	const submitReview = useSubmitReview();
	const current = queue[0];

	if (!current) {
		return <div>All reviews completed 🎉</div>;
	}

	if (!data) {
		return <div>No reviews due today 🎉</div>;
	}

	function handleRate(rating: Rating) {
		submitReview.mutate(
			{
				problemNumber: current.problemNumber,
				rating,
			},
			{
				onSuccess: () => {
					// remove the front of the queue after successful submission
					setQueue((q) => q.slice(1));
				},
			},
		);
	}

	return (
		<div className="flex flex-col justify-center p-5">
			<div className="text-center">
				<h3>{queue.length} review(s) left</h3>
				<h2 className="text-xl font-bold">
					{current.problemNumber}. {current.title}
				</h2>
				{submitReview.isSuccess && (
					<p className="text-green-500 text-lg">
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
		</div>
	);
}
