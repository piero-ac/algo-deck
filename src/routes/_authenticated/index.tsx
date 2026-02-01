import { createFileRoute } from "@tanstack/react-router";
import { ReviewsCard } from "@/components/reviews-card";
import { ProblemsCard } from "@/components/problems-card";
import { ReviewHistoryTable } from "@/components/review-history-table";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/clerk-react";

export const Route = createFileRoute("/_authenticated/")({
	component: App,
});

function App() {
	const { isLoaded, isSignedIn, user } = useUser();
	const { sessionId, getToken } = useAuth();

	// Handle the loading state
	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	const { data } = useQuery({
		queryKey: ["reviews", "progress"],
		queryFn: fetchReviewsProgress,
		throwOnError: (error) => {
			toast.error(error.message, { position: "top-right" });
			return false;
		},
	});

	return (
		<div className="w-full p-5 flex flex-col gap-4 items-center">
			{isSignedIn && (
				<header>
					<h1>
						Welcome, {user.firstName} {user.lastName}
					</h1>
					<p>User ID: {user.id}</p>
					<p>Session ID: {sessionId}</p>
				</header>
			)}
			{/* Reviews and Add Problems Cards */}
			<div className="flex justify-center gap-5">
				<ProblemsCard
					totalProblems={data?.totalProblems || 0}
					reviewed={data?.reviewed || 0}
					remaining={data?.remaining || 0}
				/>
				<ReviewsCard />
			</div>
			{/* Recent History Table */}
			<div className="w-200">
				<ReviewHistoryTable />
			</div>
		</div>
	);
}

export type ReviewsProgress = {
	totalProblems: number;
	reviewed: number;
	remaining: number;
};

async function fetchReviewsProgress(): Promise<ReviewsProgress> {
	// TODO: change 1 to appropriate userId when auth is added
	const result = await fetch("/api/reviews/progress/1");

	if (!result.ok) {
		throw new Error("Failed to history stats");
	}

	const stats: ReviewsProgress = await result.json();
	return stats;
}
