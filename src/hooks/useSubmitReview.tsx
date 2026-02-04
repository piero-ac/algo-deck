import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type ReviewResponse = {
	userId: number;
	problemNumber: number;
	nextReviewAt: Date;
};

export type Rating = "AGAIN" | "HARD" | "GOOD" | "EASY";

export function useSubmitReview() {
	return useMutation({
		mutationFn: async ({
			problemNumber,
			rating,
			token,
		}: {
			problemNumber: number;
			rating: Rating;
			token: string;
		}): Promise<ReviewResponse> => {
			const res = await fetch("/api/reviews/submit-review", {
				method: "PUT",
				body: JSON.stringify({ problemNumber, rating }),
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				let errorPayload;
				try {
					errorPayload = await res.json();
				} catch {
					errorPayload = { message: res.statusText };
				}
				throw errorPayload;
			}

			return res.json();
		},
		onSuccess: (data) => {
			toast.success(
				"Next Review At: " +
					new Date(data.nextReviewAt).toLocaleDateString("en-US"),
				{ position: "top-right" },
			);
		},
	});
}
