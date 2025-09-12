import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FolderKanban, Clock, Pencil } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ModuleType } from "@/lib/types/module";
import { useAccount } from "@/providers/AccountProvider";
import { UpdateModule } from "./UpdateModule";

interface ModuleInfoType {
  module: ModuleType;
  gradient: string;
}

export default function ModuleInfo({ module, gradient }: ModuleInfoType) {
  const { account } = useAccount();

  return (
    <section id="content" className="w-full flex-3 lg:px-6">
      {/* Header / Thumbnail */}
      <div className="relative">
        <div
          className={`relative h-40 w-full overflow-hidden rounded-t-2xl ${gradient}`}
        ></div>

        {/* Action buttons on thumbnail */}
        <div className="absolute right-2 bottom-2 flex gap-2">
          {account?.role === "LECTURER" && (
            <UpdateModule module={module}>
              <Button className="flex gap-2">
                <p>Edit This Module</p>
                <Pencil />
              </Button>
            </UpdateModule>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="rounded-lg shadow-sm"
          >
            Reposition
          </Button>
        </div>
      </div>

      <CardContent className="space-y-6 p-6">
        {/* Title */}
        <h2 className="text-2xl font-bold">{module?.title}</h2>

        {/* Category + Duration */}
        <div className="text-muted-foreground space-y-4 text-sm">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            <span className="font-medium">Category</span>
            <div className="flex gap-2">
              <Badge variant="secondary">Fundamental</Badge>
              <Badge variant="secondary">Design</Badge>
              <Badge variant="secondary">Not Urgent</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Estimate duration</span>
            <span className="text-black">
              {module?.createdAt
                ? format(module.createdAt, "dd MMM yyyy, HH:mm")
                : "-"}
            </span>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: module?.description || "" }}
        />

        <Separator />
      </CardContent>
    </section>
  );
}
