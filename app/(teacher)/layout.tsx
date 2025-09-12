import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children: ReactNode;
};
export default function TeacherLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <main className="flex h-screen w-full flex-col">{children}</main>
    </SidebarProvider>
  );
}
