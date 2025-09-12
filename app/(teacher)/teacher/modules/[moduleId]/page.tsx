"use client";

import { getModuleById } from "@/lib/networks/module";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ModuleInfo from "@/components/teacher/modules/ModuleInfo";
import ModuleFiles from "@/components/teacher/modules/ModuleFiles";

export default function ModuleDetail() {
  const { moduleId } = useParams();

  const { data: module } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => getModuleById(moduleId as string),
    enabled: !!moduleId,
  });

  if (!module) return null;

  return (
    <section className="flex p-6">
      <ModuleInfo module={module} />
      <ModuleFiles module={module} />
    </section>
  );
}
