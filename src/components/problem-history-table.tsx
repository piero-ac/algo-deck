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

type ReviewHistoryResponse = {
	reviews: ReviewHistoryItem[];
};

enum Rating {
	ONE,
	TWO,
	THREE,
	FOUR,
}

type ReviewHistoryItem = {
	id: number;
	problemNumber: number;
	rating: Rating;
	reviewedAt: Date;
	problem: {
		title: string;
	};
};

async function fetchRecentReviews(): Promise<ReviewHistoryResponse> {
	// TODO: change 1 to appropriate userId when auth is added
	const result = await fetch("/api/problems/history/all/1");

	if (!result.ok) {
		throw new Error("Failed to fetch review count");
	}

	const data: ReviewHistoryResponse = await result.json();
	return data;
}

export function ProblemHistoryTable() {
	const { data } = useQuery({
		queryKey: ["reviews", "history"],
		queryFn: fetchRecentReviews,
		throwOnError: (error) => {
			toast.error(error.message, { position: "top-right" });
			return false;
		},
	});
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
				{data &&
					data.reviews.length > 0 &&
					data.reviews.map((review) => {
						const rating = mapRating(review.rating);
						return (
							<TableRow key={review.id}>
								<TableCell>
									{review.reviewedAt.toLocaleDateString("en-US")}
								</TableCell>
								<TableCell>{review.problemNumber}</TableCell>
								<TableCell>{review.problem.title}</TableCell>
								<TableCell>{rating}</TableCell>
							</TableRow>
						);
					})}
			</TableBody>
		</Table>
	);
}

function mapRating(rating: Rating) {
	switch (rating) {
		case Rating.ONE:
			return "Again";
		case Rating.TWO:
			return "Hard";
		case Rating.THREE:
			return "Good";
		case Rating.FOUR:
			return "Easy";
		default:
			return "Again";
	}
}
