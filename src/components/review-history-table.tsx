import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

type ReviewHistoryItem = {
	id: number;
	problemNumber: number;
	rating: string;
	reviewedAt: string;
	problem: {
		title: string;
	};
};

async function fetchRecentReviews(token: string): Promise<ReviewHistoryItem[]> {
	const result = await fetch("/api/problems/history/all", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	if (!result.ok) {
		throw new Error("Failed to fetch review count");
	}

	const data = await result.json();
	return data;
}

export function ReviewHistoryTable() {
	const { getToken } = useAuth();
	const {
		data: history,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["reviews", "history"],
		queryFn: async () => {
			const token = await getToken();
			const data = await fetchRecentReviews(token as string);
			return data;
		},
		throwOnError: (error) => {
			toast.error(error.message, { position: "top-right" });
			return false;
		},
	});
	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error loading reviews</div>;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Date</TableHead>
					<TableHead>#</TableHead>
					<TableHead>Problem</TableHead>
					<TableHead>Rating</TableHead>
					{/* <TableHead className="text-right">Actions</TableHead> */}
				</TableRow>
			</TableHeader>
			<TableBody>
				{history?.length ? (
					history.map((review) => {
						const rating = mapRating(review.rating);
						return (
							<TableRow key={review.id}>
								<TableCell>
									{new Date(review.reviewedAt).toLocaleDateString("en-US")}
								</TableCell>
								<TableCell>{review.problemNumber}</TableCell>
								<TableCell>{review.problem.title}</TableCell>
								<TableCell>{rating}</TableCell>
							</TableRow>
						);
					})
				) : (
					<TableRow>
						<TableCell colSpan={4}>No reviews found</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

function mapRating(rating: string) {
	switch (rating) {
		case "ONE":
			return "Again";
		case "TWO":
			return "Hard";
		case "THREE":
			return "Good";
		case "FOUR":
			return "Easy";
		default:
			return "Again";
	}
}
