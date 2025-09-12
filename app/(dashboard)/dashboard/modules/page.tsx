// File: components/CreateModule.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getModulesByAccountId } from "@/lib/networks/module";
import { useAccount } from "@/providers/AccountProvider";
import ModuleCard from "@/components/dashboard/modules/ModuleCard";
import Link from "next/link";
import { AddNewModules } from "@/components/dashboard/modules/AddNewModules";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CreateModule() {
  const { account } = useAccount();

  const authorId =
    account?.role === "LECTURER" ? account?.id : account?.teacherId;

  const { data: modules } = useQuery({
    queryKey: ["modules", authorId],
    queryFn: () => getModulesByAccountId(authorId as string),
    enabled: !!authorId,
  });

  return (
    <section className="p-3 lg:p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="">
            <p className="text-2xl font-semibold">Modules</p>
            <p className="text-sm text-slate-500">
              These are your modules for learning
            </p>
          </div>
          {account?.role === "LECTURER" && (
            <AddNewModules>
              <Button className="flex gap-2">
                <p>Add New Module</p>
                <Plus />
              </Button>
            </AddNewModules>
          )}
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules?.map((mod) => (
            <Link key={mod.id} href={`/dashboard/modules/${mod.id}`}>
              <ModuleCard key={mod.id} module={mod} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
