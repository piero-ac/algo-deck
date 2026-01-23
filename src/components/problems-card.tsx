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

export function ProblemsCard() {
	return (
		<Card className="w-80">
			<CardHeader>
				<CardTitle>Problems</CardTitle>
				<CardAction>
					<Badge variant="secondary">100</Badge>
				</CardAction>
				<CardDescription>Remaining Problems</CardDescription>
			</CardHeader>
			<CardFooter>
				<Button className="w-full">Add Problems</Button>
			</CardFooter>
		</Card>
	);
}
