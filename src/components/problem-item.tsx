import { Button } from "@/components/ui/button";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@/components/ui/item";

export function ProblemItem({
	problemNumber,
	problemTitle,
	problemDifficulty,
}: {
	problemNumber: number;
	problemTitle: string;
	problemDifficulty: string;
}) {
	return (
		<div className="flex w-full max-w-md flex-col gap-6">
			<Item variant="outline">
				<ItemContent>
					<ItemTitle>
						{problemNumber}. {problemTitle}
					</ItemTitle>
					<ItemDescription className="capitalize">
						{problemDifficulty}
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button variant="outline" size="sm">
						Add to Reviews
					</Button>
				</ItemActions>
			</Item>
		</div>
	);
}
