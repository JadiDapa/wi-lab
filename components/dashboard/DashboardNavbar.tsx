"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { LogOut } from "lucide-react";
import Notifications from "../ui/Notifications";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { useAccount } from "@/providers/AccountProvider";
import SearchDialog from "./SearchDialog";

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
        <figure className="border-primary relative size-[44px] overflow-hidden rounded-full border">
          <Image
            src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D"
            alt="Logo"
            fill
            className="object-cover object-center"
          />
        </figure>
        <div className="">
          <p> {account?.fullName} </p>
          <p className="text-sm text-slate-500">{account?.department}</p>
        </div>
      </div>
    </div>
  );
}
