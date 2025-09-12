"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsersByTeacherId } from "@/lib/networks/user";
import { useAccount } from "@/providers/AccountProvider";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { createConversation } from "@/lib/networks/conversation";
import { ConversationType } from "@/lib/types/conversation";
import { UserType } from "@/lib/types/user";

export default function StudentMessages() {
  const [activeTab, setActiveTab] = useState("inbox");
  const { account } = useAccount();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: users } = useQuery({
    queryFn: () => getUsersByTeacherId(account?.id || ""),
    queryKey: ["users", account?.id],
    enabled: !!account?.id,
  });

  const { mutateAsync: onCreateConversation, isPending: isLoading } =
    useMutation({
      mutationFn: (values: ConversationType) => createConversation(values),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });

  if (!users) return null;

  const handleUserClick = async (user: UserType) => {
    const conv = await onCreateConversation({
      users: [account?.id!, user.id],
    });

    router.push(`/dashboard/guidances/${conv.id}`);
  };

  return (
    <div className="flex h-[90vh] max-w-sm flex-col border-r">
      {/* Top Section (Search + Tabs + Create Group Button) */}
      <div className="p-4">
        <Tabs
          defaultValue="inbox"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inbox">
              Students{" "}
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                {users.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="explore">
              Groups{" "}
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                {0}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button className="mb-4 w-full">Create New Group</Button>
        <Input placeholder="Search" className="" />
      </div>

      {/* Scrollable Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
        {users.map((user: UserType) => {
          // find the conversation between this user and the logged-in account
          const conv = user.conversations?.find((c: any) =>
            c.users.some((u: any) => u.id === account?.id),
          );

          console.log(conv);

          // get the last message in that conversation
          const lastMessage = conv?.messages?.[0];

          return (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="flex cursor-pointer items-center justify-between rounded-lg border p-2 py-3 hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={"/images/icon.png"} alt={user.fullName} />
                  <AvatarFallback>
                    {user.fullName?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{user.fullName}</p>
                  <p className="w-[240px] truncate text-xs text-gray-500">
                    {lastMessage?.content || "No messages yet"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end text-xs text-gray-400">
                {lastMessage?.createdAt && (
                  <span>
                    {format(new Date(lastMessage.createdAt), "HH:mm")}
                  </span>
                )}
                {lastMessage && !lastMessage.readAt && (
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
