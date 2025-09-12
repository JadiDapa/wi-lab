import Link from "next/link";
import AuthCarousel from "@/components/auth/AuthCarousel";
import AuthHeader from "@/components/auth/AuthHeader";
import SignUpForm from "@/components/auth/sign-up/SignUpForm";

export default function RegisterPages() {
  return (
    <section className="grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
      <AuthCarousel />
      <main className="flex flex-col items-center justify-center p-8 lg:px-40">
        <AuthHeader
          title="Hey, Welcome!"
          subtitle="We need you to register a new account so we can knew that it is you!"
        />
        <SignUpForm />
        <p className="mt-4 text-center lg:mt-6">
          Already have an account?{" "}
          <Link className="text-primary underline" href="/sign-in">
            Login Now!
          </Link>
        </p>
      </main>
    </section>
  );
}
