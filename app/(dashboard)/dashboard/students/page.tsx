"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, MapPin, MoreHorizontal, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUsersByTeacherId } from "@/lib/networks/user";
import { useAccount } from "@/providers/AccountProvider";

export default function UsersSection() {
  const [query, setQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);

  const { account } = useAccount();

  const { data: students } = useQuery({
    queryFn: () => getUsersByTeacherId(account?.id as string),
    queryKey: ["students", account?.id as string],
    enabled: !!account?.id,
  });

  const filtered = useMemo(() => {
    return students?.filter((u) => {
      if (departmentFilter && u.department !== departmentFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.nim?.toLowerCase().includes(q) ||
        u.department?.toLowerCase().includes(q)
      );
    });
  }, [departmentFilter, query, students]);

  if (!filtered) return null;

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium">Your Students</h2>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <Select
              onValueChange={(v) => setDepartmentFilter(v === "all" ? null : v)}
            >
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Account Owner">Account Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search in All Users"
                className="h-9 pl-10"
              />
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            </div>

            <Button variant="ghost" className="h-9">
              Recent
            </Button>
            <div className="text-muted-foreground px-3 text-sm">
              {filtered.length} users
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((user) => (
          <Card key={user.id} className="p-3">
            <CardHeader className="flex items-center gap-4 p-0">
              <Avatar className="size-24">
                <AvatarImage src={user.avatarUrl || ""} alt={user.fullName} />
                <AvatarFallback>
                  {user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{user.fullName}</div>
                    <div className="text-muted-foreground text-xs">
                      {user.department}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Message</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="text-muted-foreground mt-2 space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{user.nim}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{user.department}</span>
                  </div>

                  {/* <div
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${
                      user.status === "active"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.statusText}
                  </div> */}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
        <Link href="/dashboard/students/add">
          <Card className="flex cursor-pointer items-center justify-center gap-3 border-2 border-dashed p-3 text-center shadow-none transition hover:border-blue-300 hover:bg-blue-50">
            <div className="">
              <PlusCircle className="size-10" />
            </div>
            <div>
              <h4 className="text-lg font-semibold">Add More Student</h4>
              <p className="text-muted-foreground mt-1 text-xs">
                You can add more student to guide
              </p>
            </div>
          </Card>
        </Link>
      </div>
    </section>
  );
}
