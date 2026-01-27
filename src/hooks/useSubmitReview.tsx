import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type ReviewResponse = {
	nextReviewAt: string;
	stability: number;
	difficulty: number;
};

export function useSubmitReview() {
	return useMutation({
		mutationFn: async ({
			problemNumber,
			rating,
		}: {
			problemNumber: number;
			rating: "again" | "good" | "easy" | "hard";
		}): Promise<ReviewResponse> => {
			const res = await fetch(`/api/review/${problemNumber}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ rating }),
			});

			if (!res.ok) throw new Error("Failed to submit review");
			return res.json();
		},
		onSuccess: (data) => {
			// console.log("Next review info:", data);
			// Here you can show a toaster or UI message with nextReviewAt
			toast.success(
				"Next Review At: " +
					new Date(data.nextReviewAt).toLocaleDateString("en-US"),
			);
		},
	});
}
