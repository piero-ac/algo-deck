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

export function ReviewsCard() {
	return (
		<Card className="w-80">
			<CardHeader>
				<CardTitle>Reviews</CardTitle>
				<CardAction>
					<Badge variant="secondary">3</Badge>
				</CardAction>
				<CardDescription>Do your reviews.</CardDescription>
			</CardHeader>
			<CardFooter>
				<Button className="w-full">Start Reviews</Button>
			</CardFooter>
		</Card>
	);
}
