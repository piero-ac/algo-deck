import { createFileRoute } from "@tanstack/react-router";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/test")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isLoaded, isSignedIn, user } = useUser();
	const { sessionId, getToken } = useAuth();

	if (!isLoaded || !user) {
		return <div>User loading...</div>;
	}

	const { data, isLoading, error } = useQuery({
		queryKey: ["userId"],
		queryFn: async () => {
			const token = await getToken();
			const result = await fetch("/api/", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (!result.ok) {
				throw new Error("Something went wrong!");
			}
			const data = await result.text();
			console.log(data);
			return data;
		},
	});

	if (isLoading) {
		return <p>Retreiving userId</p>;
	}

	if (error) {
		return <p>Error loading user</p>;
	}

	return (
		<div>
			<h1>user data</h1>
			<p>isSignedIn: {isSignedIn}</p>
			<p>Session Id: {sessionId}</p>
			<p>{user.fullName}</p>

			<p>UserId: {data}</p>
		</div>
	);
}
