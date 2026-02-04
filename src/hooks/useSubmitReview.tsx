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
			token,
		}: {
			problemNumber: number;
			rating: Rating;
			userId: string;
			token: string;
		}): Promise<ReviewResponse> => {
			const res = await fetch("/api/reviews/submit-review", {
				method: "PUT",
				body: JSON.stringify({ userId, problemNumber, rating }),
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
