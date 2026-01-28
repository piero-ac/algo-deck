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

export function ProblemsCard({
	problemCount,
	reviewedProblemsCount,
}: {
	problemCount: number;
	reviewedProblemsCount: number;
}) {
	const navigate = useNavigate();

	return (
		<Card className="w-80">
			<CardHeader>
				<CardTitle>Problems</CardTitle>
				<CardAction>
					<Badge variant="secondary">
						{problemCount - reviewedProblemsCount}
					</Badge>
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
