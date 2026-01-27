import { Home, Target, History, BookCheck } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import { ModeToggle } from "@/components/mode-toggle";

import { Link } from "@tanstack/react-router";

// Menu items.
const items = [
	{
		title: "Home",
		url: "/",
		icon: Home,
	},
	{
		title: "Reviews",
		url: "/reviews",
		icon: Target,
	},
	{
		title: "Lessons",
		url: "/lessons",
		icon: BookCheck,
	},
	{
		title: "History",
		url: "/history",
		icon: History,
	},
];

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				{/* Application Menu */}
				<SidebarGroup>
					<SidebarGroupLabel>AlgoDeck</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link to={item.url} className="flex items-center space-x-2">
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarContent>
						<ModeToggle />
					</SidebarContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
