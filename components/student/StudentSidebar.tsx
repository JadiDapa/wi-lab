"use client";

import {
  Home,
  LogOut,
  Mailbox,
  MessageSquareText,
  Newspaper,
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAccount } from "@/providers/AccountProvider";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/lib/networks/user";

// Menu items.
const overviewItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },

  {
    title: "Modules",
    url: "modules",
    icon: Newspaper,
  },
  {
    title: "Guidances",
    url: "guidances",
    icon: MessageSquareText,
  },

  {
    title: "Inbox",
    url: "inbox",
    icon: Mailbox,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "#",
    icon: LogOut,
  },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  const { account } = useAccount();

  const { data: teacher } = useQuery({
    queryKey: ["teacher", account?.teacherId],
    queryFn: () => getUserById(account?.teacherId as string),
    enabled: !!account?.teacherId,
  });

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
                  const url = `/student/${item.url}`;
                  const active = pathname.startsWith(url);

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
            <SidebarGroupLabel>LECTURER</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {teacher && (
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={teacher.avatarUrl || ""}
                        alt={teacher.fullName}
                      />
                      <AvatarFallback>
                        {teacher.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="">
                      <p className="text-md font-medium">{teacher.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {teacher.department || "No Department"}
                      </p>
                    </div>
                  </div>
                )}
              </SidebarMenu>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
