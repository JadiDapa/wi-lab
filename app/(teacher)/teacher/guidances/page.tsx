import StudentMessages from "@/components/teacher/guidances/StudentMessages";
import WelcomeChat from "@/components/teacher/guidances/WelcomeChat";
import React from "react";

export default function GudidancesPage() {
  return (
    <section className="flex">
      <StudentMessages />
      <WelcomeChat />
      {/* <UserProfile /> */}
    </section>
  );
}
