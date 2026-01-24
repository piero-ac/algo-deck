import { SearchProblemsInput } from "@/components/search-problems-input";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/problems")({
	component: RouteComponent,
});

function RouteComponent() {
	const [search, setSearch] = useState("");

	function handleSearchInput(text: string) {
		setSearch(text);
	}

	return (
		<div className="p-5">
			<div className="w-80">
				<SearchProblemsInput input={search} onChange={handleSearchInput} />
			</div>
			{/* Problems Based on input */}
			{/* Table of Problems with Pagination */}
		</div>
	);
}
