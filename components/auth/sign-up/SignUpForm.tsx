"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

import {
  Eye,
  EyeClosed,
  LoaderCircle,
  Lock,
  Mail,
  User,
  IdCard,
  BookOpen,
} from "lucide-react";

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/lib/networks/user";
import { CreateUserType, Role } from "@/lib/types/user";

// Validation schema
const signupSchema = z
  .object({
    fullname: z.string().min(3, "Name must be at least 3 characters"),
    role: z.enum(["STUDENT", "TEACHER"] as [string, ...string[]]),
    nimOrNip: z.string().min(3, "NIM/NIP must be at least 3 characters"),
    department: z.string().min(2, "Department must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const verifySchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [signupData, setSignupData] = useState<z.infer<
    typeof signupSchema
  > | null>(null);

  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const { mutateAsync: createUserAsync } = useMutation({
    mutationFn: (values: CreateUserType) => createUser(values),
    onError: () => toast.error("Something Went Wrong!"),
  });

  const form = useForm({
    resolver: zodResolver(pendingVerification ? verifySchema : signupSchema),
    defaultValues: {
      fullname: "",
      role: "STUDENT",
      nimOrNip: "",
      department: "",
      email: "",
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  // Step 1: Create user
  async function onSubmit(values: z.infer<typeof signupSchema>) {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      setSignupData(values); // save for later

      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      form.setValue("code", "");

      toast.info("Verification code sent to your email.");
    } catch (error: any) {
      console.error("Sign-up error:", error);
      toast.error(error.errors?.[0]?.message || "Sign-up failed.");
    } finally {
      setIsLoading(false);
    }
  }

  // Step 2: Verify email
  async function onVerify(values: z.infer<typeof verifySchema>) {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: values.code!,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });

        await createUserAsync({
          fullName: signupData?.fullname ?? "",
          nim:
            signupData?.role === "STUDENT" ? signupData?.nimOrNip : undefined,
          nip:
            signupData?.role === "TEACHER" ? signupData?.nimOrNip : undefined,
          department: signupData?.department ?? "",
          email: signUp.emailAddress!,
          role: signupData?.role as Role,
        });

        toast.success("Account created successfully!");
        router.push("/");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.errors?.[0]?.message || "Invalid code.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFormSubmit(
    values: z.infer<typeof signupSchema> | z.infer<typeof verifySchema>,
  ) {
    if (pendingVerification) {
      await onVerify(values as z.infer<typeof verifySchema>);
    } else {
      await onSubmit(values as z.infer<typeof signupSchema>);
    }
  }

  const selectedRole = form.watch("role");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="mt-4 w-full lg:mt-6"
      >
        <div className="space-y-4">
          {!pendingVerification ? (
            <>
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem className="relative">
                    <User className="text-primary absolute top-1/2 left-3 -translate-y-1/2" />
                    <FormControl>
                      <Input
                        placeholder="Full Name"
                        className="ps-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                {/* Role */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="STUDENT">Student</SelectItem>
                            <SelectItem value="TEACHER">Teacher</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* NIM or NIP */}
                <FormField
                  control={form.control}
                  name="nimOrNip"
                  render={({ field }) => (
                    <FormItem className="relative flex-1">
                      <IdCard className="text-primary absolute top-1/2 left-3 -translate-y-1/2" />
                      <FormControl>
                        <Input
                          placeholder={
                            selectedRole === "TEACHER" ? "NIP" : "NIM"
                          }
                          className="ps-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Department */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem className="relative">
                    <BookOpen className="text-primary absolute top-1/2 left-3 -translate-y-1/2" />
                    <FormControl>
                      <Input
                        placeholder="Department"
                        className="ps-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative">
                    <Mail className="text-primary absolute top-1/2 left-3 -translate-y-1/2" />
                    <FormControl>
                      <Input placeholder="Email" className="ps-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <Lock className="text-primary absolute top-1/2 left-3 -translate-y-1/2" />
                    <div
                      onClick={() => setIsVisible(!isVisible)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                    >
                      {isVisible ? <Eye /> : <EyeClosed />}
                    </div>
                    <FormControl>
                      <Input
                        type={isVisible ? "text" : "password"}
                        placeholder="Password"
                        className="ps-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <Lock className="text-primary absolute top-1/2 left-3 -translate-y-1/2" />
                    <div
                      onClick={() => setIsVisible(!isVisible)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                    >
                      {isVisible ? <Eye /> : <EyeClosed />}
                    </div>
                    <FormControl>
                      <Input
                        type={isVisible ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="ps-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
                      onChange={(value) => field.onChange(value)}
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
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div id="clerk-captcha"></div>

        <Button
          disabled={isLoading}
          type="submit"
          className="mt-6 flex w-full items-center justify-center gap-3"
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
