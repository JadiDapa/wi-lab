"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { LogOut } from "lucide-react";
import Notifications from "../ui/Notifications";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { useAccount } from "@/providers/AccountProvider";
import SearchDialog from "./SearchDialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function DashboardNavbar() {
  const { account } = useAccount();
  const { signOut } = useClerk();

  if (!account) return null;

  return (
    <div className="flex w-full justify-between border-b bg-white p-3 px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <SearchDialog />
      </div>
      <div className="flex items-center gap-6">
        <LogOut
          onClick={() => signOut({ redirectUrl: "/" })}
          strokeWidth={1.8}
          size={24}
        />
        <Notifications />
        <Avatar className="size-12">
          <AvatarImage src={account.avatarUrl || ""} alt={account.fullName} />
          <AvatarFallback>
            {account.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="">
          <p> {account?.fullName} </p>
          <p className="text-sm text-slate-500">{account?.department}</p>
        </div>
      </div>
    </div>
  );
}
