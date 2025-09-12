"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MoreHorizontal, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ModuleType } from "@/lib/types/module";

// Define a palette of nice Tailwind colors
const gradientColors = [
  ["from-indigo-400", "to-orange-300"],
  ["from-pink-400", "to-purple-400"],
  ["from-emerald-400", "to-teal-300"],
  ["from-blue-400", "to-cyan-300"],
  ["from-amber-400", "to-red-300"],
  ["from-lime-400", "to-green-300"],
  ["from-fuchsia-400", "to-pink-300"],
  ["from-sky-400", "to-indigo-300"],
];

// Hash function to convert module.id → number
function hashId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0; // Convert to 32bit int
  }
  return Math.abs(hash);
}

export default function ModuleCard({ module }: { module: ModuleType }) {
  const hash = hashId(module.id);
  const gradient = gradientColors[hash % gradientColors.length];
  const gradientClass = `bg-gradient-to-r ${gradient[0]} ${gradient[1]}`;

  return (
    <Card className="w-full max-w-md gap-0 rounded-2xl border py-0 shadow-md">
      <div className="relative">
        {/* Banner image (deterministic gradient) */}
        <div className={`h-32 w-full rounded-t-2xl ${gradientClass}`} />

        {/* Visibility Badge */}
        <Badge className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
          {module.visibility}
        </Badge>
      </div>

      <CardContent className="space-y-3 p-4">
        {/* Title */}
        <h3 className="text-lg leading-snug font-semibold">{module.title}</h3>

        {/* Description */}
        <div className="h-10 overflow-hidden">
          {module.description && (
            <p
              className="prose text-muted-foreground line-clamp-2 text-sm"
              dangerouslySetInnerHTML={{ __html: module?.description || "" }}
            ></p>
          )}
        </div>

        {/* Author + Info */}
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>
            Lecturer:{" "}
            <span className="font-medium"> {module.author.fullName}</span>
          </span>
          <span>
            {formatDistanceToNow(new Date(module.updatedAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {/* Footer */}
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          {/* Files count */}
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4" />
            <span>{module.files?.length ?? 0} Files</span>
          </div>

          <MoreHorizontal className="h-5 w-5 cursor-pointer" />
        </div>
      </CardContent>
    </Card>
  );
}
