import { useSubmitReview } from "@/hooks/useSubmitReview";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { type Rating } from "@/hooks/useSubmitReview";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

type ReviewItem = {
	userId: number;
	problemNumber: number;
	problem: {
		title: string;
	};
};

type ReviewsApiResponse = ReviewItem[];

export const Route = createFileRoute("/_authenticated/reviews")({
	component: RouteComponent,
	loader: async (): Promise<ReviewsApiResponse> => {
		await window.Clerk?.load();

		const token = await window.Clerk?.session?.getToken();

		if (!token) {
			throw new Error("Not authenticated");
		}

		const countResult = await fetch("/api/reviews/count", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (!countResult.ok) {
			throw new Error("Could not fetch review count");
		}
		const reviewsCount: number = await countResult.json();

		if (reviewsCount === 0) {
			throw redirect({ to: "/" });
		}

		const reviewsDataResult = await fetch("/api/reviews/due", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (!reviewsDataResult.ok) {
			throw new Error("Could not fetch reviews");
		}
		const reviewsData = await reviewsDataResult.json();

		return reviewsData;
	},
});

function RouteComponent() {
	const { isLoaded, isSignedIn, user } = useUser();
	const navigate = useNavigate();
	const reviews = Route.useLoaderData();
	const [queue, setQueue] = useState<ReviewItem[]>(() => reviews);
	const submitReview = useSubmitReview();
	const current = queue[0];

	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			navigate({ to: "/login" });
		}
	}, [isLoaded, isSignedIn, navigate]);

	if (!isLoaded) {
		return <div>Retrievin user info</div>;
	}

	if (!current) {
		return <div>All reviews completed 🎉</div>;
	}

	if (!reviews) {
		return <div>No reviews due today 🎉</div>;
	}

	async function handleRate(rating: Rating) {
		const token = (await window.Clerk?.session?.getToken()) as string;
		submitReview.mutate(
			{
				problemNumber: current.problemNumber,
				rating,
				userId: user?.id!,
				token,
			},
			{
				onSuccess: () => {
					setQueue((q) => q.slice(1));
					submitReview.reset();
				},
			},
		);
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
	);
}
