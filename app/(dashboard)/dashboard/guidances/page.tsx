import SelectUserChat from "@/components/dashboard/guidances/SelectUserChat";
import WelcomeChat from "@/components/dashboard/guidances/WelcomeChat";
import React from "react";

export default function GudidancesPage() {
  return (
    <section className="flex">
      <SelectUserChat />
      <WelcomeChat />
    </section>
  );
}
