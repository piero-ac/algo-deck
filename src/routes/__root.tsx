import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";

export const Route = createRootRoute({
	component: () => (
		<>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<SidebarProvider>
					<AppSidebar />
					<main className="w-full">
						<SidebarTrigger />
						<Outlet />
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
	),
});
