import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { MessageType } from "@/lib/types/message";
import { File } from "lucide-react";

type MessageListProps = {
  messages: MessageType[];
  accountId: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

type MessageBubbleProps = {
  msg: MessageType;
  isOwn: boolean;
};

function MessageBubble({ msg, isOwn }: MessageBubbleProps) {
  const bubbleBase = "max-w-xs rounded-lg px-4 py-2 text-sm shadow transition";
  const bubbleColor = isOwn
    ? "rounded-br-none bg-primary text-white"
    : "rounded-bl-none bg-white text-gray-800";

  const time = (
    <div className="mt-1 text-right text-[10px] text-gray-400">
      {new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
  );

  switch (msg.contentType) {
    case "TEXT":
      return (
        <div className={`${bubbleBase} ${bubbleColor}`}>
          {msg.content}
          {time}
        </div>
      );

    case "IMAGE":
      return (
        <Dialog>
          <DialogTrigger
            className={`${bubbleBase} ${bubbleColor} p-2t border-0`}
          >
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={msg.attachment || ""}
                alt="Sent image"
                className="w-64 rounded-sm object-cover"
              />
            }
            <p className="mt-1 w-full text-end">{msg.content}</p>
            {time}
          </DialogTrigger>
          <DialogContent className="h-[80vh] p-0">
            <>
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={msg.attachment || ""}
                  alt="Sent image"
                  className="w-full rounded-sm"
                />
              }
              <p className="mt-1 w-full text-end">{msg.content}</p>
              <p>{time}</p>
            </>
          </DialogContent>
        </Dialog>
      );

    case "FILE":
      return (
        <div className={`${bubbleBase} ${bubbleColor} flex items-center gap-2`}>
          <File className="h-4 w-4 shrink-0" />
          <a
            href={msg.attachment as string}
            download
            className="truncate hover:text-blue-400"
          >
            {msg.content}
          </a>
          {time}
        </div>
      );

    default:
      return null;
  }
}

export default function MessageList({
  messages,
  accountId,
  messagesEndRef,
}: MessageListProps) {
  return (
    <div className="flex-1 space-y-2 overflow-y-scroll bg-gray-50 p-4">
      {messages.map((msg) => {
        const isOwn = msg.sender.id === accountId;
        return (
          <div
            key={msg.id}
            className={`flex break-words whitespace-pre-wrap ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <MessageBubble msg={msg} isOwn={isOwn} />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
