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
	addProblemToLesson,
	problemInQueue,
}: {
	problemNumber: number;
	problemTitle: string;
	problemDifficulty: string;
	addProblemToLesson: (problem: {
		number: number;
		title: string;
		difficulty: string;
	}) => void;
	problemInQueue: boolean;
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
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							addProblemToLesson({
								number: problemNumber,
								title: problemTitle,
								difficulty: problemDifficulty,
							});
						}}
						disabled={problemInQueue}
					>
						Add to Lesson
					</Button>
				</ItemActions>
			</Item>
		</div>
	);
}
