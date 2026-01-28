import { createFileRoute } from "@tanstack/react-router";
import { ReviewsCard } from "@/components/reviews-card";
import { ProblemsCard } from "@/components/problems-card";
import { ProblemHistoryTable } from "@/components/problem-history-table";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const { data } = useQuery({
		queryKey: ["history", "stats"],
		queryFn: fetchHistoryStats,
		throwOnError: (error) => {
			toast.error(error.message, { position: "top-right" });
			return false;
		},
	});

	return (
		<div className="w-full p-5 flex flex-col gap-4 items-center">
			{/* Reviews and Add Problems Cards */}
			<div className="flex justify-center gap-5">
				<ProblemsCard
					problemCount={data?.problemsCount || 0}
					reviewedProblemsCount={data?.reviewedProblemsCount || 0}
				/>
				<ReviewsCard />
			</div>
			{/* Recent History Table */}
			<div className="w-200">
				<ProblemHistoryTable />
			</div>
		</div>
	);
}

type HistoryStats = {
	problemsCount: number;
	reviewedProblemsCount: number;
};

async function fetchHistoryStats(): Promise<HistoryStats> {
	const result = await fetch("/api/history/stats");

	if (!result.ok) {
		throw new Error("Failed to history stats");
	}

	const stats: HistoryStats = await result.json();
	return stats;
}
