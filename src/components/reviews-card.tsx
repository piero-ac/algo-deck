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

async function fetchReviewCount(): Promise<number> {
	// TODO: change 1 to appropriate userId when auth is added
	const result = await fetch("/api/reviews/count/1");

	if (!result.ok) {
		throw new Error("Failed to fetch review count");
	}

	const count = await result.json();
	return count;
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
