// import { Button } from "@/components/ui/button";
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuSeparator,
// 	DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
// import { MoreHorizontalIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type ReviewHistoryResponse = {
	count: number;
	reviews: {
		problem_number: number;
		rating: number;
		reviewed_at: string;
		problem_title: string;
		id: string;
	}[];
};

async function fetchRecentReviews(): Promise<ReviewHistoryResponse> {
	const result = await fetch("/api/problems/history?key=all");

	if (!result.ok) {
		throw new Error("Failed to fetch review count");
	}

	const data: ReviewHistoryResponse = await result.json();
	return data;
}

export function ProblemHistoryTable() {
	const { data } = useQuery({
		queryKey: ["reviews", "history"],
		queryFn: fetchRecentReviews,
		throwOnError: (error) => {
			toast.error(error.message, { position: "top-right" });
			return false;
		},
	});
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Date</TableHead>
					<TableHead>#</TableHead>
					<TableHead>Problem</TableHead>
					<TableHead>Rating</TableHead>
					{/* <TableHead className="text-right">Actions</TableHead> */}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data &&
					data.count > 0 &&
					data.reviews.map((review) => {
						let rating;
						switch (review.rating) {
							case 1:
								rating = "Again";
								break;
							case 2:
								rating = "Hard";
								break;
							case 3:
								rating = "Good";
								break;
							case 4:
								rating = "Easy";
								break;
							default:
								rating = "Again";
						}
						return (
							<TableRow key={review.id}>
								<TableCell>
									{new Date(review.reviewed_at).toLocaleDateString("en-US")}
								</TableCell>
								<TableCell>{review.problem_number}</TableCell>
								<TableCell>{review.problem_title}</TableCell>
								<TableCell>{rating}</TableCell>
								{/* <TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon" className="size-8">
												<MoreHorizontalIcon />
												<span className="sr-only">Open menu</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>Edit</DropdownMenuItem>
											<DropdownMenuItem>Duplicate</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem variant="destructive">
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell> */}
							</TableRow>
						);
					})}
			</TableBody>
		</Table>
	);
}
