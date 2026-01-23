import { createFileRoute } from "@tanstack/react-router";
import { ReviewsCard } from "@/components/reviews-card";
import { ProblemsCard } from "@/components/problems-card";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="w-full p-5">
			{/* Reviews and Add Problems Cards */}
			<div className="flex gap-5">
				<ProblemsCard />
				<ReviewsCard />
			</div>
			{/* Recent History Table */}
		</div>
	);
}
