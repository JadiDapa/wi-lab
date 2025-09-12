import { UserType } from "@/lib/types/user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

export default function ChatItem({
  user,
  accountId,
  onClick,
}: {
  user: UserType;
  accountId: string;
  onClick: (u: UserType) => void;
}) {
  const conv = user.conversations?.find((c: any) =>
    c.users.some((u: any) => u.id === accountId),
  );
  const lastMessage = conv?.messages?.[0];

  // Format preview for last message
  const renderLastMessage = () => {
    if (!lastMessage) return "No messages yet";

    const text = lastMessage.content?.trim() || "";
    const type = lastMessage.contentType;

    if (type === "IMAGE") {
      return text ? `${text} · [Image]` : "[Image]";
    }
    if (type === "FILE") {
      return text ? `${text} · [File]` : "[File]";
    }

    return text || "No messages yet";
  };

  return (
    <div
      key={user.id}
      onClick={() => onClick(user)}
      className="flex cursor-pointer items-center justify-between rounded-lg border p-2 py-3 hover:bg-gray-100"
    >
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={"/images/icon.png"} alt={user.fullName} />
          <AvatarFallback>{user.fullName?.charAt(0) ?? "?"}</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <p className="font-medium">{user.fullName}</p>
          <p className="w-[240px] truncate text-xs text-gray-500">
            {renderLastMessage()}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end text-xs text-gray-400">
        {lastMessage?.createdAt && (
          <span>{format(new Date(lastMessage.createdAt), "HH:mm")}</span>
        )}
        {lastMessage && !lastMessage.readAt && (
          <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
        )}
      </div>
    </div>
  );
}
