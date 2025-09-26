"use client";

import {
  Calendar,
  Home,
  Inbox,
  Lightbulb,
  LogOut,
  Mailbox,
  MessageSquareText,
  Newspaper,
  ScrollText,
  Search,
  Settings,
  Users,
} from "lucide-react";

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
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAccount } from "@/providers/AccountProvider";
import { useQuery } from "@tanstack/react-query";
import { getUserById, getUsersByTeacherId } from "@/lib/networks/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Role } from "@/lib/types/user";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";

// Menu items.
const overviewItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    role: "all",
  },
  {
    title: "Peserta",
    url: "/dashboard/students",
    icon: Users,
    role: "lecturer",
  },
  {
    title: "Widyaiswara",
    url: "/dashboard/teachers",
    icon: Users,
    role: "student",
  },
  {
    title: "Coaching Clinic",
    url: "/dashboard/guidances",
    icon: MessageSquareText,
    role: "all",
  },
  {
    title: "Modul Belajar",
    url: "/dashboard/modules",
    icon: Newspaper,
    role: "all",
  },
  {
    title: "Inovasi Peserta",
    url: "#",
    icon: Lightbulb,
    role: "all",
  },
  {
    title: "Jurnal",
    url: "#",
    icon: ScrollText,
    role: "all",
  },
];

const settingsItems = [
  {
    title: "Pengaturan",
    url: "#",
    icon: Settings,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const { account } = useAccount();
  const { signOut } = useClerk();

  const userRole = account?.role as Role;

  const { data: teacher } = useQuery({
    queryKey: ["teacher", account?.teacherId],
    queryFn: () => getUserById(account?.teacherId as string),
    enabled: userRole === "STUDENT" && !!account?.teacherId,
  });

  const { data: students } = useQuery({
    queryKey: ["students", account?.id],
    queryFn: () => getUsersByTeacherId(account?.id as string),
    enabled: userRole === "LECTURER" && !!account?.id,
  });

  console.log(userRole);

  return (
    <Sidebar>
      <SidebarContent className="flex h-screen flex-col">
        {/* Logo + Overview + Students */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex items-center justify-center gap-3 py-3 pt-4">
            <div className="relative size-10 lg:size-12">
              <Image
                src="/images/icon.png"
                alt="logo"
                fill
                className="object-contain object-center"
              />
            </div>
            <div className="text-primary text-3xl font-semibold tracking-wide">
              <p style={{ textShadow: "3px 3px 1px #38bdf8" }}>WI-LAB</p>
            </div>
          </div>

          {/* Overview */}
          <SidebarGroup className="px-6 pt-1 pb-2">
            <SidebarGroupLabel>MENU</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {overviewItems.map((item) => {
                  const url = item.url;

                  let active = false;

                  if (url === "/dashboard") {
                    // Only active if exactly on /dashboard
                    active = pathname === url;
                  } else {
                    // Other menus: active if pathname matches or inside their sub-routes
                    active = pathname === url || pathname.startsWith(`${url}/`);
                  }

                  if (item.role === "lecturer" && userRole !== Role.LECTURER) {
                    return null;
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={url}
                          className={`flex h-9 items-center gap-x-4 gap-y-1 rounded-md px-2 py-1 transition-colors ${
                            active
                              ? "bg-primary text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="size-5" />
                          <span className="text-base">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Students */}
          <SidebarGroup className="px-6 pt-0 pb-2">
            <SidebarGroupLabel>
              {userRole === "LECTURER" ? "PESERTA" : "WIDYAISWARA"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {userRole === "LECTURER" && (
                <SidebarMenu>
                  {students?.map((student) => (
                    <div key={student.id} className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={student.avatarUrl || ""}
                          alt={student.fullName}
                        />
                        <AvatarFallback>
                          {student.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="">
                        <p className="text-md font-medium">
                          {student.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {student.department || "No Department"}
                        </p>
                      </div>
                    </div>
                  ))}
                </SidebarMenu>
              )}
              {userRole === "STUDENT" && (
                <SidebarMenu>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={teacher?.avatarUrl || ""}
                        alt={teacher?.fullName}
                      />
                      <AvatarFallback>
                        {teacher?.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="">
                      <p className="text-md font-medium">{teacher?.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {teacher?.department || "No Department"}
                      </p>
                    </div>
                  </div>
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* SETTINGS pinned to bottom */}
        <SidebarGroup className="mt-auto shrink-0 px-6 pt-0 pb-6">
          {/* <SidebarGroupLabel>SETTINGS</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-x-4 gap-y-1"
                    >
                      <item.icon className="size-5" />
                      <span className="text-base">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div
                    onClick={() => signOut({ redirectUrl: "/" })}
                    className="flex items-center gap-x-4 gap-y-1"
                  >
                    <LogOut className="size-5" />
                    <span className="text-base">Keluar</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
