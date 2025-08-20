"use client";

import Hero from "@/components/root/home/Hero";
import { useClerk } from "@clerk/nextjs";

export default function HomePage() {
  const { signOut } = useClerk();
  return (
    <>
      <Hero />
      <button
        onClick={() => signOut({ redirectUrl: "/" })} // redirect to home after logout
        className="rounded bg-red-500 px-4 py-2 text-white"
      >
        Logout
      </button>
      {/* <Features />
      <Footer /> */}
    </>
  );
}
