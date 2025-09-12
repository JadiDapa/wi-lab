import TeacherMessages from "@/components/student/guidances/TeacherMessages";
import WelcomeChat from "@/components/teacher/guidances/WelcomeChat";
import React from "react";

export default function GudidancesPage() {
  return (
    <section className="flex">
      <TeacherMessages />
      <WelcomeChat />
      {/* <UserProfile /> */}
    </section>
  );
}
