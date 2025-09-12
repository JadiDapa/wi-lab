"use client";

import {
  Calendar,
  Home,
  Inbox,
  LogOut,
  Mailbox,
  MessageSquareText,
  Newspaper,
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

// Menu items.
const overviewItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    role: "all",
  },
  {
    title: "Students",
    url: "students",
    icon: Users,
    role: "lecturer",
  },
  {
    title: "Modules",
    url: "modules",
    icon: Newspaper,
    role: "all",
  },
  {
    title: "Guidances",
    url: "guidances",
    icon: MessageSquareText,
    role: "all",
  },

  {
    title: "Inbox",
    url: "inbox",
    icon: Mailbox,
    role: "all",
  },
];

const settingsItems = [
  {
    title: "Settings",
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
          <div className="relative mx-auto h-24 w-38 shrink-0">
            <Image
              src="/images/icon.png"
              alt="Logo WI-LAB"
              fill
              className="object-contain object-center"
            />
          </div>

          {/* Overview */}
          <SidebarGroup className="px-6 pt-0 pb-2">
            <SidebarGroupLabel>OVERVIEW</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {overviewItems.map((item) => {
                  const url = `/dashboard/${item.url}`;
                  const active = pathname.startsWith(url);

                  if (item.role === "lecturer" && userRole !== Role.LECTURER) {
                    return null;
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={url}
                          className={`flex items-center gap-x-4 gap-y-1 rounded-md px-2 py-1 transition-colors ${
                            active
                              ? "bg-primary text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <item.icon className="size-5" />
                          <span className="text-base">{item.title}</span>
                        </a>
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
              {userRole === "LECTURER" ? "STUDENTS" : "LECTURER"}
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
          <SidebarGroupLabel>SETTINGS</SidebarGroupLabel>
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
                    <span className="text-base">Log Out</span>
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
