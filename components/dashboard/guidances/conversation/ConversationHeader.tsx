import Image from "next/image";

export default function ConversationHeader({
  conversationName,
}: {
  conversationName: string;
}) {
  return (
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
          <h2 className="font-semibold">{conversationName}</h2>
          <p className="text-xs text-gray-500">last seen today at 15:53</p>
        </div>
      </div>
    </div>
  );
}
