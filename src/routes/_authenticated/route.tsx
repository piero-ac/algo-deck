import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "sonner";

export const Route = createFileRoute("/_authenticated")({
	component: RouteComponent,
	async beforeLoad(ctx) {
		const token = await ctx.context.auth?.getToken();
		if (!token)
			throw redirect({
				to: "/login",
			});
	},
});

function RouteComponent() {
	return (
		<>
			<SidebarProvider>
				<AppSidebar />
				<main className="w-full">
					<SidebarTrigger />
					<Outlet />
					<Toaster />
				</main>
			</SidebarProvider>
		</>
	);
}
