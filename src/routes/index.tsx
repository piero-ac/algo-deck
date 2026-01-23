import { createFileRoute } from "@tanstack/react-router";
import { ReviewsCard } from "@/components/reviews-card";
import { ProblemsCard } from "@/components/problems-card";
import { ProblemHistoryTable } from "@/components/problem-history-table";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="w-full p-5 flex flex-col gap-4 items-center">
			{/* Reviews and Add Problems Cards */}
			<div className="flex justify-center gap-5">
				<ProblemsCard />
				<ReviewsCard />
			</div>
			{/* Recent History Table */}
			<div className="w-200">
				<ProblemHistoryTable />
			</div>
		</div>
	);
}
