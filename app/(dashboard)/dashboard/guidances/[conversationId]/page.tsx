"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import {
  getMessagesByConversationId,
  createMessage,
} from "@/lib/networks/message";
import { useParams } from "next/navigation";
import {
  CreateMessageType,
  MessageContentType,
  MessageType,
} from "@/lib/types/message";
import { toast } from "sonner";
import { useAccount } from "@/providers/AccountProvider";
import { getConversationById } from "@/lib/networks/conversation";
import { useQuery } from "@tanstack/react-query";
import SelectUserChat from "@/components/dashboard/guidances/SelectUserChat";
import MessageInput from "@/components/dashboard/guidances/conversation/MessageInput";
import MessageList from "@/components/dashboard/guidances/conversation/MessageList";
import ConversationHeader from "@/components/dashboard/guidances/conversation/ConversationHeader";
import { format } from "date-fns";
import { Lock } from "lucide-react";
import { getUserById } from "@/lib/networks/user";

export default function GuidanceChatPage() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { conversationId } = useParams<{ conversationId: string }>();
  const { account } = useAccount();

  const lecturerId =
    account?.role === "LECTURER" ? account?.id : account?.teacherId;

  const { data: user } = useQuery({
    queryKey: ["user", lecturerId],
    queryFn: () => getUserById(lecturerId!),
    enabled: !!lecturerId,
  });

  const { data: conversation } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversationById(conversationId!),
    enabled: !!conversationId,
  });

  // derive locked state dynamically
  const isLocked = user?.nextOpenTime
    ? new Date(user.nextOpenTime) > new Date()
    : false;

  useEffect(() => {
    const handleMessage = (data: MessageType) => {
      setMessages((prev) => [...prev, data]);
    };

    const handleUserJoined = (data: string) => {
      setMessages((prev) => [
        ...prev,
        {
          content: data,
          sender: { fullName: "System" },
        } as MessageType,
      ]);
    };

    socket.on("message", handleMessage);
    socket.on("user-joined", handleUserJoined);

    return () => {
      socket.off("message", handleMessage);
      socket.off("user-joined", handleUserJoined);
    };
  }, []);

  useEffect(() => {
    if (conversationId && account?.fullName) {
      socket.emit("join-room", {
        room: conversationId,
        sender: { fullName: account.fullName },
      });
    }
  }, [conversationId, account]);

  /* --------------------------- Fetch old messages -------------------------- */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const initialMessages =
          await getMessagesByConversationId(conversationId);
        setMessages(initialMessages);
      } catch {
        toast.error("Failed to load messages");
      }
    };

    if (conversationId) fetchMessages();
  }, [conversationId]);

  /* ------------------------- Auto resize textarea -------------------------- */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 24 * 5)}px`;
    }
  }, [input]);

  /* -------------------------- Auto scroll bottom --------------------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ------------------------------ Send message ----------------------------- */
  const sendMessage = async (file?: File, type?: "IMAGE" | "FILE") => {
    try {
      const content = input.trim();
      let contentType: MessageContentType = "TEXT";
      let attachment: File | undefined;

      if (file && type) {
        contentType = type;
        attachment = file;
      }

      // prevent sending empty message if no text and no file
      if (!content && !attachment) return;

      const newMessage: CreateMessageType = {
        senderId: account?.id || "",
        conversationId,
        content,
        contentType,
        attachment, // pass file if exists
      };

      const savedMessage = await createMessage(newMessage);
      setMessages((prev) => [...prev, savedMessage]);
      socket.emit("message", savedMessage);

      setInput("");
    } catch {
      toast.error("Failed to send message");
    }
  };

  return (
    <section className="flex">
      {/* Sidebar */}
      <SelectUserChat />

      {/* Chat window */}
      <div className="mx-auto flex h-[90vh] flex-1 flex-col bg-white">
        <ConversationHeader
          conversationName={
            conversation?.users.find((u) => u.id !== account?.id)?.fullName ??
            "Unknown User"
          }
        />
        <MessageList
          messages={messages}
          accountId={account?.id ?? ""}
          messagesEndRef={messagesEndRef}
        />
        {isLocked ? (
          <div className="bg-muted/40 flex flex-col items-center justify-center border-t p-4 text-center">
            <p className="text-muted-foreground text-sm font-medium">
              Guidance session is currently
            </p>
            <div className="flex items-center gap-3 py-2">
              <p className="text-primary text-lg font-bold">Locked</p>
              <Lock className="text-muted-foreground size-5" />
            </div>
            {user?.nextOpenTime && (
              <p className="text-muted-foreground mt-2 text-sm">
                Next session opens at{" "}
                <span className="text-foreground font-semibold">
                  {format(user.nextOpenTime, "PPpp")}
                </span>
              </p>
            )}
          </div>
        ) : (
          <MessageInput
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            textareaRef={textareaRef}
          />
        )}
      </div>
    </section>
  );
}
