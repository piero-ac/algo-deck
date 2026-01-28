import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

type ReviewCountResponse = {
	review_count: number;
};

async function fetchReviewCount(): Promise<number> {
	const result = await fetch("http://localhost:4200/reviews/count");

	if (!result.ok) {
		throw new Error("Failed to fetch review count");
	}

	const rows: ReviewCountResponse[] = await result.json();
	return rows[0]?.review_count ?? 0;
}

export function ReviewsCard() {
	const { data: review_count = 0 } = useQuery({
		queryKey: ["reviews", "count"],
		queryFn: fetchReviewCount,
		throwOnError: (error) => {
			toast.error(error.message, { position: "top-right" });
			return false;
		},
	});
	const navigate = useNavigate();

	return (
		<Card className="w-80">
			<CardHeader>
				<CardTitle>Reviews</CardTitle>
				<CardAction>
					<Badge variant="secondary">{review_count}</Badge>
				</CardAction>
				<CardDescription>Do your reviews.</CardDescription>
			</CardHeader>
			<CardFooter>
				<Button
					className="w-full"
					disabled={review_count === 0}
					onClick={() => navigate({ to: "/reviews" })}
				>
					Start Reviews
				</Button>
			</CardFooter>
		</Card>
	);
}
