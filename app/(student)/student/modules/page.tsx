// File: components/CreateModule.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { getModulesByAccountId } from "@/lib/networks/module";
import { useAccount } from "@/providers/AccountProvider";
import ModuleCard from "@/components/teacher/modules/ModuleCard";
import Link from "next/link";
import { AddNewModules } from "@/components/teacher/modules/AddNewModules";

export default function CreateModule() {
  const { account } = useAccount();

  const { data: modules } = useQuery({
    queryKey: ["modules", account?.id],
    queryFn: () => getModulesByAccountId(account?.id as string),
    enabled: !!account?.id,
  });

  return (
    <section className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p>Modules</p>
          <AddNewModules />
        </div>

        <div className="grid w-full grid-cols-3 gap-6">
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
