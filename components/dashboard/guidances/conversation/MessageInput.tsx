"use client";

import { useRef, useState } from "react";
import {
  Paperclip,
  Image as ImageIcon,
  SendHorizonal,
  File,
  X,
} from "lucide-react";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  sendMessage: (file?: File, type?: "IMAGE" | "FILE") => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export default function MessageInput({
  input,
  setInput,
  sendMessage,
  textareaRef,
}: MessageInputProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // store file temporarily
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<"IMAGE" | "FILE" | null>(
    null,
  );

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "IMAGE" | "FILE",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedType(type);
    }
    if (e.target) e.target.value = ""; // reset input
  };

  const handleSend = () => {
    sendMessage(selectedFile || undefined, selectedType || undefined);
    setSelectedFile(null);
    setSelectedType(null);
  };

  return (
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

        {/* File preview (if user selected one) */}
        {selectedFile && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {selectedType === "IMAGE" ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                className="h-10 w-10 rounded object-cover"
              />
            ) : (
              <span className="max-w-[120px] truncate">
                {selectedFile.name}
              </span>
            )}
            <button
              onClick={() => {
                setSelectedFile(null);
                setSelectedType(null);
              }}
              className="text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex gap-3 text-slate-500">
          {/* File Uploads */}
          <button onClick={() => fileInputRef.current?.click()} type="button">
            <Paperclip size={22} />
          </button>
          <button onClick={() => imageInputRef.current?.click()} type="button">
            <ImageIcon size={22} />
          </button>
          <button onClick={() => fileInputRef.current?.click()} type="button">
            <File size={22} />
          </button>

          {/* Hidden Inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFileChange(e, "IMAGE")}
          />
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={(e) => handleFileChange(e, "FILE")}
          />
        </div>
      </div>
      <button
        onClick={handleSend}
        className="cursor-pointer rounded-full bg-green-500 p-3 text-white shadow hover:bg-green-600"
      >
        <SendHorizonal size={18} />
      </button>
    </div>
  );
}
