"use client";

import { getModuleById } from "@/lib/networks/module";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ModuleInfo from "@/components/dashboard/modules/ModuleInfo";
import ModuleFiles from "@/components/dashboard/modules/ModuleFiles";

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

export default function ModuleDetail() {
  const { moduleId } = useParams();

  const hash = hashId(moduleId as string);
  const gradient = gradientColors[hash % gradientColors.length];
  const gradientClass = `bg-gradient-to-r ${gradient[0]} ${gradient[1]}`;

  const { data: module } = useQuery({
    queryKey: ["modules", moduleId],
    queryFn: () => getModuleById(moduleId as string),
    enabled: !!moduleId,
  });

  if (!module) return null;

  return (
    <section className="flex flex-col p-3 lg:flex-row lg:p-6">
      <ModuleInfo module={module} gradient={gradientClass} />
      <ModuleFiles module={module} />
    </section>
  );
}
