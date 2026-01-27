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
	results: {
		problem_number: number;
		problem_title: string;
		problem_difficulty: string;
	}[];
	totalPages: number;
};

export const Route = createFileRoute("/problems")({
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
	const { add, inQueue } = useLessonsQueue();

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
			});
		}
	}, [searchDebounced, search, navigate]);

	const { data, isLoading, error } = useQuery({
		queryKey: ["problems", search, page],
		queryFn: async (): Promise<SearchDataResponse> => {
			const result = await fetch(
				`http://localhost:4200/problems?search=${encodeURIComponent(search)}&page=${page}`,
			);
			if (!result.ok) throw new Error("Failed to fetch problems");
			return result.json();
		},
		staleTime: 2 * 60 * 1000, // Data stays fresh for 2minutes
		refetchOnWindowFocus: false, // Don't refetch when window regains focus
		refetchOnMount: false, // Don't refetch when component mounts if data is cached
	});

	function handleSearchInput(text: string) {
		setInput(text);
	}

	function handleNextPage() {
		if (data && page < data.totalPages) {
			navigate({
				search: (prev) => ({ ...prev, page: prev.page + 1 }),
			});
		}
	}

	function handlePrevPage() {
		if (data && page > 1) {
			navigate({
				search: (prev) => ({ ...prev, page: prev.page - 1 }),
			});
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

				<div className="flex flex-col gap-1">
					{!isLoading && data?.total === 0 && (
						<p className="text-muted-foreground">No problems found.</p>
					)}
					{isLoading && <p>Loading...</p>}
					{error && <p>Error: {(error as Error).message}</p>}
					{data &&
						data.total > 0 &&
						data.results.map((problem) => {
							return (
								<ProblemItem
									key={problem.problem_number}
									problemDifficulty={problem.problem_difficulty}
									problemTitle={problem.problem_title}
									problemNumber={problem.problem_number}
									addProblemToLesson={add}
									problemInQueue={inQueue(problem)}
								/>
							);
						})}
				</div>
			</div>
		</div>
	);
}
