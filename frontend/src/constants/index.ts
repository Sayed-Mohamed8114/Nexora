import {
  LayoutDashboard,
  House,
  User,
  BookOpen,
  Lightbulb,
  ChartColumn,
  Settings,
} from "lucide-react";

export const sidebarLinks = [
  {
    path: "/dashboard",
    label: "Global Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/my-dashboard",
    label: "My Dashboard",
    icon: House,
  },
  {
    path: "/profile",
    label: "Profile",
    icon: User,
  },
  {
    path: "/courses",
    label: "Courses",
    icon: BookOpen,
  },
  {
    path: "/recommendations",
    label: "Recommendations",
    icon: Lightbulb,
  },
  {
    path: "/reports",
    label: "Reports",
    icon: ChartColumn,
  },
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
  },
];
