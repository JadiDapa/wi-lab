"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import { File, Image, Paperclip, SendHorizonal } from "lucide-react";
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
export default function RoomChat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { conversationId } = useParams<{ conversationId: string }>();

  const { account } = useAccount();

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
    <div className="mx-auto flex h-screen w-[60%] flex-col border bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-xl font-bold">Realtime Chat</h1>

      <div className="mb-4 flex-1 overflow-y-auto rounded border bg-gray-50 p-3">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <strong>{msg.sender.fullName}:</strong> {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-4">
          <Paperclip className="text-slate-500" />
          <div className="flex flex-1 items-center rounded-3xl border px-6">
            <textarea
              ref={textareaRef}
              className="flex-1 resize-none py-2 outline-none"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                console.log("Key pressed:", e.key, "Shift?", e.shiftKey);
                if ((e.key === "Enter" || e.key === "Return") && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
            />

            <div className="flex gap-2">
              <Image className="text-slate-500" />
              <File className="text-slate-500" />
            </div>
          </div>
        </div>
        <button
          onClick={sendMessage}
          className="cursor-pointer rounded bg-blue-500 p-2 text-white"
        >
          <SendHorizonal />
        </button>
      </div>
    </div>
  );
}
