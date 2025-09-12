import { MessagesSquare } from "lucide-react";
import React from "react";

export default function WelcomeChat() {
  return (
    <div className="hidden flex-1 flex-col items-center justify-center lg:flex">
      <div className="">
        <MessagesSquare className="text-foreground size-40" />
      </div>
      <p className="mt-4 text-5xl font-medium">Start Conversation</p>
      <p className="text-muted-foreground mt-2">
        Select Any Users to Start Messaging
      </p>
    </div>
  );
}
