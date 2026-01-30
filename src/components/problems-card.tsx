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
import { useNavigate } from "@tanstack/react-router";
import { type ReviewsProgress } from "@/routes";

export function ProblemsCard({
	totalProblems,
	remaining,
	reviewed,
}: ReviewsProgress) {
	const navigate = useNavigate();

	return (
		<Card className="w-80">
			<CardHeader>
				<CardTitle>Problems</CardTitle>
				<CardAction>
					<Badge variant="default">{reviewed}</Badge>
					<Badge variant="destructive">{remaining}</Badge>
				</CardAction>
				<CardDescription>Remaining Problems</CardDescription>
			</CardHeader>
			<CardFooter>
				<Button
					className="w-full"
					onClick={() =>
						navigate({ to: "/problems", search: { search: "", page: 1 } })
					}
				>
					Add Problems
				</Button>
			</CardFooter>
		</Card>
	);
}
