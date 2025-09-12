"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import {
  File,
  Image as ImageIcon,
  Paperclip,
  SendHorizonal,
} from "lucide-react";
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
import TeacherMessages from "@/components/student/guidances/TeacherMessages";
import Image from "next/image";
import { getConversationById } from "@/lib/networks/conversation";
import { useQuery } from "@tanstack/react-query";

export default function GuidanceChatPage() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { conversationId } = useParams<{ conversationId: string }>();

  const { account } = useAccount();

  const { data: conversation } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversationById(conversationId!),
    enabled: !!conversationId,
  });

  // Join conversation room
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
      console.log("Joining room:", conversationId); // ✅ check here
      socket.emit("join-room", {
        room: conversationId,
        sender: { fullName: account.fullName },
      });
    }
  }, [conversationId, account]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const initialMessages =
          await getMessagesByConversationId(conversationId);
        setMessages(initialMessages);
      } catch (err) {
        toast.error("Failed to load messages");
      }
    };

    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 24 * 5)}px`;
    }
  }, [input]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: CreateMessageType = {
      senderId: account?.id || "",
      conversationId,
      content: input,
      contentType: "TEXT" as MessageContentType,
    };

    try {
      // ✅ 1. Save message to backend
      const savedMessage = await createMessage(newMessage);

      // ✅ 2. Update UI with real saved message (includes ID, timestamps, etc.)
      setMessages((prev) => [...prev, savedMessage]);

      // ✅ 3. Emit to socket so other clients receive it
      socket.emit("message", savedMessage);

      // Reset input
      setInput("");
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  return (
    <section className="flex">
      {/* Sidebar with users */}
      <TeacherMessages />

      {/* Chat window */}
      <div className="mx-auto flex h-[90vh] flex-1 flex-col border bg-white">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <div className="relative size-10 overflow-hidden rounded-full">
              <Image
                src="/images/icon.png"
                alt="avatar"
                fill
                className="object-cover object-center"
              />
            </div>
            <div>
              <h2 className="font-semibold">
                {conversation?.users.find((u) => u.id !== account?.id)
                  ?.fullName ?? "Unknown User"}
              </h2>
              <p className="text-xs text-gray-500">last seen today at 15:53</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 flex ${
                msg.sender.id === account?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-2 text-sm shadow ${
                  msg.sender.id === account?.id
                    ? "rounded-br-none bg-green-500 text-white"
                    : "rounded-bl-none bg-white text-gray-800"
                }`}
              >
                {msg.content}
                <div className="mt-1 text-right text-[10px] text-gray-300">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="flex items-center gap-2 border-t bg-white p-3">
          <div className="flex flex-1 items-center gap-3 rounded-3xl border px-4">
            <textarea
              ref={textareaRef}
              className="flex-1 resize-none py-2 outline-none"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <div className="flex gap-2 text-slate-500">
              <Paperclip size={18} />
              <ImageIcon size={18} />
              <File size={18} />
            </div>
          </div>
          <button
            onClick={sendMessage}
            className="cursor-pointer rounded-full bg-green-500 p-3 text-white shadow hover:bg-green-600"
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
