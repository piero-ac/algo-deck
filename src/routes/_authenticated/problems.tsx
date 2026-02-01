import { SearchProblemsInput } from "@/components/search-problems-input";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ProblemItem } from "@/components/problem-item";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useLessonsQueue } from "@/context/lessonQueue";

type SearchDataResponse = {
	page: number;
	pageSize: number;
	total: number;
	problems: {
		number: number;
		title: string;
		difficulty: string;
	}[];
	totalPages: number;
};

export const Route = createFileRoute("/_authenticated/problems")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>) => ({
		search: typeof search.search === "string" ? search.search : "",
		page: Number.isInteger(Number(search.page)) ? Number(search.page) : 1,
	}),
});

function RouteComponent() {
	// const loaderData = Route.useLoaderData();
	const searchParams = Route.useSearch();
	const search = searchParams.search;
	const page = searchParams.page;
	const [input, setInput] = useState(search);
	const [searchDebounced] = useDebounce(input, 1000);
	const navigate = useNavigate({ from: Route.fullPath });
	const { add, inQueue, queue, removeFromQueue } = useLessonsQueue();

	// Sync input state when URL search param changes (browser back/forward)
	useEffect(() => {
		setInput(search);
	}, [search]);

	// Sync URL when debounced search changes
	useEffect(() => {
		if (searchDebounced !== search) {
			navigate({
				search: (prev) => ({
					...prev,
					search: searchDebounced,
					page: 1, // Reset to page 1 on new search
				}),
				replace: true,
			})
		}
	}, [searchDebounced, search, navigate]);

	const { data, isLoading, error } = useQuery({
		queryKey: ["problems", search, page],
		queryFn: async (): Promise<SearchDataResponse> => {
			// TODO: change 1 to appropriate userId when auth is added
			const result = await fetch(
				`/api/problems?search=${encodeURIComponent(search)}&page=${page}&limit=20&userId=1`,
			)
			if (!result.ok) throw new Error("Failed to fetch problems");
			return result.json();
		},
		staleTime: 2 * 60 * 1000, // Data stays fresh for 2minutes
		refetchOnWindowFocus: false, // Don't refetch when window regains focus
		refetchOnMount: false, // Don't refetch when component mounts if data is cached
	})

	function handleSearchInput(text: string) {
		setInput(text);
	}

	function handleNextPage() {
		if (data && page < data.totalPages) {
			navigate({
				search: (prev) => ({ ...prev, page: prev.page + 1 }),
			})
		}
	}

	function handlePrevPage() {
		if (data && page > 1) {
			navigate({
				search: (prev) => ({ ...prev, page: prev.page - 1 }),
			})
		}
	}

	return (
		<div className="p-5 flex flex-col items-center">
			<div className="w-120 mb-4">
				<SearchProblemsInput input={input} onChange={handleSearchInput} />
			</div>
			<div className="w-[50%] flex flex-col items-center ">
				{!isLoading && data?.total !== 0 && (
					<div className="flex gap-6 mb-2  items-center justify-center">
						<div>
							<p>
								{data?.page} of {data?.totalPages}
							</p>
						</div>
						<div>
							<Button
								variant="outline"
								onClick={handlePrevPage}
								disabled={page === 1}
							>
								Prev
							</Button>{" "}
							<Button
								variant="outline"
								onClick={handleNextPage}
								disabled={page === data?.totalPages}
							>
								Next
							</Button>
						</div>
					</div>
				)}

				<div className="flex gap-4">
					{/* Problems List Display */}
					<div className="flex flex-col gap-1 flex-3">
						{!isLoading && data?.problems.length === 0 && (
							<p className="">No problems found.</p>
						)}
						{isLoading && <p>Loading...</p>}
						{error && <p>Error: {(error as Error).message}</p>}
						{data &&
							data.total > 0 &&
							data.problems.map((problem) => {
								return (
									<ProblemItem
										key={problem.number}
										problemDifficulty={problem.difficulty}
										problemTitle={problem.title}
										problemNumber={problem.number}
										addProblemToLesson={add}
										problemInQueue={inQueue(problem)}
									/>
								)
							})}
					</div>
					{/* Lessons Queue Display */}
					<div className="flex-1">
						{queue.length === 0 && (
							<p>
								Click on <span className="font-bold">Add to Lesson</span> to
								create a Queue
							</p>
						)}
						{queue.length > 0 &&
							queue.map((lesson) => {
								return (
									<div
										key={lesson.number}
										className="flex items-center mb-2 gap-3 "
									>
										<div className="text-center w-50">
											<p className="text-sm">{lesson.title.slice(0, 20)}...</p>
										</div>
										<div className="text-center">
											<span className="font-bold">[{lesson.number}]</span>
											<Button
												variant="destructive"
												size="xs"
												onClick={() => removeFromQueue(lesson)}
											>
												Remove
											</Button>
										</div>
									</div>
								)
							})}
					</div>
				</div>
			</div>
		</div>
	)
}
