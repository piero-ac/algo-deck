import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type ReviewResponse = {
	userId: number;
	problemNumber: number;
	nextReviewAt: Date;
};

export type Rating = "1" | "2" | "3" | "4";

export function useSubmitReview() {
	return useMutation({
		mutationFn: async ({
			problemNumber,
			rating,
			userId,
		}: {
			problemNumber: number;
			rating: Rating;
			userId: number;
		}): Promise<ReviewResponse> => {
			const res = await fetch("/api/reviews/submit-review", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId, problemNumber, rating }),
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
