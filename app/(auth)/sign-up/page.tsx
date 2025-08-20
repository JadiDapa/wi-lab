import Link from "next/link";
import Image from "next/image";
import SignUpForm from "@/components/auth/sign-up/SignUpForm";
import AuthHeader from "@/providers/AuthHeader";

export default function RegisterPages() {
  return (
    <section className="relative grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
      <div className="absolute z-0 h-full w-full">
        <Image src="/images/login-bg.png" alt="Login Background" fill />
      </div>
      <div className=""></div>
      <main className="relative z-10 m-6 flex flex-col items-center justify-center rounded-2xl bg-white/90 p-8 lg:px-40">
        <AuthHeader
          title="Welcome! Sign Up Now"
          subtitle="Before we continue further, We need you to create a new account!"
        />
        <SignUpForm />
        <p className="mt-4 text-center lg:mt-6">
          Don&apos;t have an account?{" "}
          <Link className="text-primary underline" href="/register">
            Create Now!
          </Link>
        </p>
      </main>
    </section>
  );
}
