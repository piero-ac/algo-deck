import {
	Outlet,
	createRootRoute,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import type { useAuth } from "@clerk/clerk-react";

interface RootRouteContext {
	auth?: ReturnType<typeof useAuth>;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
	component: App,
});

function App() {
	return (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<SidebarProvider>
					<AppSidebar />
					<main className="w-full">
						<SidebarTrigger />
						<Outlet />
						<Toaster />
					</main>
				</SidebarProvider>
			</ThemeProvider>
			<ReactQueryDevtools buttonPosition="top-right" />
			<TanStackDevtools
				config={{
					position: "bottom-right",
				}}
				plugins={[
					{
						name: "Tanstack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</>
	);
}
