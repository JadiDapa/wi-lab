import DashboardHeader from "@/components/dashboard/dashboard/DashboardHeader";
import DashboardModules from "@/components/dashboard/dashboard/DashboardModules";
import DashboardProjects from "@/components/dashboard/dashboard/DashboardProjects";
import DashboardStats from "@/components/dashboard/dashboard/DashboardStats";

export default function DashboardDashboardPage() {
  return (
    <section className="space-y-6 p-6">
      <DashboardHeader />
      <DashboardStats />
      <DashboardModules />
      <DashboardProjects />
    </section>
  );
}
