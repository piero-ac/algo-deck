import { Button } from "@/components/ui/button";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@/components/ui/item";
import { useState } from "react";

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
		problem_number: number;
		problem_title: string;
		problem_difficulty: string;
	}) => void;
	problemInQueue: boolean;
}) {
	const [clicked, setClicked] = useState(false);
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
								problem_number: problemNumber,
								problem_title: problemTitle,
								problem_difficulty: problemDifficulty,
							});

							setClicked(true);
						}}
						disabled={clicked || problemInQueue}
					>
						Add to Lesson
					</Button>
				</ItemActions>
			</Item>
		</div>
	);
}
