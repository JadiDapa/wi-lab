"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserById,
  getUsersByTeacherId,
  updateUser,
} from "@/lib/networks/user";
import { useAccount } from "@/providers/AccountProvider";
import { usePathname, useRouter } from "next/navigation";
import { createConversation } from "@/lib/networks/conversation";
import { ConversationType } from "@/lib/types/conversation";
import { Role, UserType } from "@/lib/types/user";
import { ChatList } from "./ChatList";
import ChatHeader from "./ChatHeader";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lock, Settings } from "lucide-react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SelectUserChat() {
  const [nextOpen, setNextOpen] = useState<Date | undefined>(undefined);

  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState("inbox");
  const { account } = useAccount();
  const queryClient = useQueryClient();
  const router = useRouter();

  const userRole = account?.role as Role;

  useEffect(() => {
    if (account) {
      setNextOpen(
        account.nextOpenTime ? new Date(account.nextOpenTime) : undefined,
      );
    }
  }, [account]);

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

  const { mutateAsync: onCreateConversation } = useMutation({
    mutationFn: (values: ConversationType) => createConversation(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const { mutateAsync: onUpdateUser } = useMutation({
    mutationFn: (values: UserType) => updateUser(account?.id as string, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", account?.id] });
    },
  });

  const handleUserClick = async (user: UserType) => {
    const conv = await onCreateConversation({
      users: [account?.id!, user.id],
    });
    router.push(`/dashboard/guidances/${conv.id}`);
  };

  const users: UserType[] =
    userRole === "STUDENT" ? (teacher ? [teacher] : []) : (students ?? []);

  const handleSaveLockSettings = async () => {
    await onUpdateUser({
      ...account!,
      nextOpenTime: nextOpen,
    });
  };

  const isChatRoom = pathname.startsWith("/dashboard/guidances/");

  return (
    <div
      className={`flex h-[90vh] w-full flex-col border-r bg-white lg:max-w-sm ${isChatRoom && "max-lg:hidden"}`}
    >
      <ChatHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        usersCount={users.length}
      />
      <ChatList
        users={users}
        accountId={account?.id ?? ""}
        onClick={handleUserClick}
      />

      {/* Only show lock controls for lecturers */}
      {userRole === "LECTURER" && (
        <div className="mt-auto border-t p-2 py-3">
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex h-[42px] gap-3">
                <Button variant="outline" className="flex-1">
                  {account?.isConversationLocked ? (
                    <p>
                      <span>Opened At : </span>
                      <span className="text-primary font-bold">
                        {format(account?.nextOpenTime, "PPpp")}
                      </span>
                    </p>
                  ) : (
                    <p>Unlock Conversations</p>
                  )}
                  <Lock />
                </Button>
                <Button variant="outline" className="">
                  <Settings />
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Conversation Lock Settings</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                {/* Toggle lock */}

                {/* Date/Time Picker */}
                <Label>Next Open Time</Label>
                <DatePicker
                  selected={nextOpen}
                  onChange={(date) => setNextOpen(date ?? undefined)}
                  showTimeSelect
                  timeIntervals={60} // you can change this to 5, 10, 30 etc.
                  dateFormat="Pp" // localized date + time
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholderText="Select date and time"
                />
              </div>

              <DialogFooter>
                <Button onClick={handleSaveLockSettings}>Lock Guidance</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
