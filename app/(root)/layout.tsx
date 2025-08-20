import Navbar from "@/components/root/Navbar";
import Footer from "@/components/root/Footer";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export default function RootLayout({ children }: Props) {
  return (
    <section className="bg-background text-foreground overflow-hidden">
      <Navbar />
      <div className="">{children}</div>
      <Footer />
    </section>
  );
}
