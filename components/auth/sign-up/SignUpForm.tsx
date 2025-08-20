"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import { Eye, EyeClosed, LoaderCircle, Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/lib/networks/user";
import { CreateUserType, Role } from "@/lib/types/user";

// Validation schema
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const verifySchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const queryClient = useQueryClient();
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const { mutateAsync: createUserAsync } = useMutation({
    mutationFn: (values: CreateUserType) => createUser(values),
    onError: () => toast.error("Something Went Wrong!"),
  });

  const form = useForm({
    resolver: zodResolver(pendingVerification ? verifySchema : signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      code: "",
    },
  });

  // Step 1: Create user
  async function onSubmit(values: z.infer<typeof signupSchema>) {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      await signUp.create({
        username: values.username,
        emailAddress: values.email,
        password: values.password,
      });

      // Send verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);

      // ✅ Reset form so "code" field starts empty
      form.reset({ code: "" });

      toast.info("Verification code sent to your email.");
    } catch (error: any) {
      console.error("Sign-up error:", error);
      toast.error(error.errors?.[0]?.message || "Sign-up failed.");
    } finally {
      setIsLoading(false);
    }
  }

  // Step 2: Verify email
  // Step 2: Verify email
  async function onVerify(values: z.infer<typeof verifySchema>) {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: values.code!,
      });

      if (result.status === "complete" && result.createdSessionId) {
        // ✅ Set Clerk active session
        await setActive({ session: result.createdSessionId });

        // ✅ Create user in your own database
        await createUserAsync({
          fullName: signUp.username!,
          email: signUp.emailAddress!,
          role: "STUDENT" as unknown as Role,
        });

        toast.success("Account created successfully!");
        router.push("/");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(error.errors?.[0]?.message || "Invalid code.");
    } finally {
      setIsLoading(false);
    }
  }

  // Unified submit handler
  async function handleFormSubmit(
    values: z.infer<typeof signupSchema> | z.infer<typeof verifySchema>,
  ) {
    if (pendingVerification) {
      await onVerify(values as z.infer<typeof verifySchema>);
    } else {
      await onSubmit(values as z.infer<typeof signupSchema>);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="mt-4 w-full lg:mt-6"
      >
        <div className="space-y-4">
          {!pendingVerification ? (
            <>
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="relative">
                    <User
                      size={24}
                      className="text-primary absolute top-1/2 left-3 -translate-y-1/2"
                    />
                    <FormControl>
                      <Input
                        className="border-primary h-10 w-full rounded-lg border-2 ps-12 lg:h-12"
                        placeholder="Username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative">
                    <Mail
                      size={24}
                      className="text-primary absolute top-1/2 left-3 -translate-y-1/2"
                    />
                    <FormControl>
                      <Input
                        className="border-primary h-10 w-full rounded-lg border-2 ps-12 lg:h-12"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <Lock
                      size={24}
                      className="text-primary absolute top-1/2 left-3 -translate-y-1/2"
                    />
                    <div
                      onClick={() => setIsVisible(!isVisible)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                    >
                      {isVisible ? <Eye size={24} /> : <EyeClosed size={24} />}
                    </div>
                    <FormControl>
                      <Input
                        className="border-primary h-10 w-full rounded-lg border-2 ps-12 lg:h-12"
                        placeholder="Password"
                        type={isVisible ? "text" : "password"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={(value) => field.onChange(value)} // 👈 FIX
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />
          )}
        </div>
        <div id="clerk-captcha"></div>

        <Button
          disabled={isLoading}
          type="submit"
          className="mt-6 flex h-10 w-full cursor-pointer items-center gap-3 text-lg lg:mt-10 lg:h-12"
        >
          {isLoading ? (
            <>
              Submitting
              <LoaderCircle className="h-6 w-6 animate-spin text-gray-500" />
            </>
          ) : pendingVerification ? (
            "Verify Code"
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
      <DevTool control={form.control} />
    </Form>
  );
}
