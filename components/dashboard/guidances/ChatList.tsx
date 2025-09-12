import { UserType } from "@/lib/types/user";
import ChatItem from "./ChatItem";

export function ChatList({
  users,
  accountId,
  onClick,
}: {
  users: UserType[];
  accountId: string;
  onClick: (u: UserType) => void;
}) {
  return (
    <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
      {users.map((user) => (
        <ChatItem
          key={user.id}
          user={user}
          accountId={accountId}
          onClick={onClick}
        />
      ))}
    </div>
  );
}
