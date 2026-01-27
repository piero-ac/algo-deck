import React, { createContext, useContext, useState } from "react";

// Define the Lesson type
export type Lesson = {
	problem_number: number;
	problem_title: string;
	problem_difficulty: string;
};

// Define the shape of the context
type LessonsQueueContextType = {
	queue: Lesson[];
	add: (lesson: Lesson) => void;
	removeNext: () => Lesson | undefined;
	removeFromQueue: (lesson: Lesson) => void;
};

// Create the context
const LessonsQueueContext = createContext<LessonsQueueContextType | null>(null);

// Provider component
export const LessonsQueueProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [queue, setQueue] = useState<Lesson[]>([]);

	// Add a new lesson to the queue
	const add = (lesson: Lesson) => setQueue((prev) => [...prev, lesson]);

	// Remove lesson from the queue
	const removeFromQueue = (lesson: Lesson) =>
		setQueue((prev) =>
			prev.filter(
				(problem) => lesson.problem_number !== problem.problem_number,
			),
		);

	// Remove the first lesson from the queue
	const removeNext = () => {
		let next: Lesson | undefined;
		setQueue((prev) => {
			next = prev[0];
			return prev.slice(1);
		});
		return next;
	};

	return (
		<LessonsQueueContext.Provider
			value={{ queue, add, removeNext, removeFromQueue }}
		>
			{children}
		</LessonsQueueContext.Provider>
	);
};

// Hook for components to access the queue
export const useLessonsQueue = () => {
	const context = useContext(LessonsQueueContext);
	if (!context)
		throw new Error(
			"useLessonsQueue must be used within a LessonsQueueProvider",
		);
	return context;
};
