import {
  LayoutDashboard,
  House,
  User,
  BookOpen,
  Lightbulb,
  ChartColumn,
  Bell,
} from "lucide-react";

export const sidebarLinksForStudent = [
  {
    path: "/GlobalDashboard",
    label: "Global Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/dashboard",
    label: "Dashboard",
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
    path: "/mycourses",
    label: "My Courses",
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
    path: "/notification",
    label: "Notifications",
    icon: Bell,
  },
];

export const sidebarLinksForAdmin = [
  {
    path: "/dashboard",
    label: "Dashboard",
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
    path: "/mycourses",
    label: "My Courses",
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
    path: "/notification",
    label: "Notifications",
    icon: Bell,
  },
];

export const courses = [
  {
    id: 1,
    title: "Course 1",
    description: "Description 1",
    skills: ["skill1", "skill2", "skill3"],
    level: "Beginner",
    duration: "2 hours",
    image: "/assets/courses/img1.webp",
  },
  {
    id: 2,
    title: "Course 2",
    description: "Description 2",
    skills: ["skill1", "skill2", "skill3"],
    level: "Beginner",
    duration: "2 hours",
    image: "/assets/courses/img2.webp",
  },
  {
    id: 3,
    title: "Course 3",
    description: "Description 3",
    skills: ["skill1", "skill2", "skill3"],
    level: "Beginner",
    duration: "2 hours",
    image: "/assets/courses/img3.webp",
  },
  {
    id: 4,
    title: "Course 4",
    description: "Description 4",
    skills: ["skill1", "skill2", "skill3"],
    level: "Beginner",
    duration: "2 hours",
    image: "/assets/courses/img4.webp",
  },
  {
    id: 5,
    title: "Course 5",
    description: "Description 5",
    skills: ["skill1", "skill2", "skill3"],
    level: "Beginner",
    duration: "2 hours",
    image: "/assets/courses/img5.webp",
  },
  {
    id: 6,
    title: "Course 6",
    description: "Description 6",
    skills: ["skill1", "skill2", "skill3"],
    level: "Beginner",
    duration: "2 hours",
    image: "/assets/courses/img6.webp",
  },
  {
    id: 7,
    title: "Course 7",
    description: "Description 7",
    skills: ["skill1", "skill2", "skill3"],
    level: "Beginner",
    duration: "2 hours",
    image: "/assets/courses/img7.webp",
  },
];
