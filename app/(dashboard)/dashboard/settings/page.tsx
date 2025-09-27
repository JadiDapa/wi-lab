"use client";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getUserById, updateUser } from "@/lib/networks/user";
import { CreateUserType } from "@/lib/types/user";
import { useAccount } from "@/providers/AccountProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import z from "zod";
import Image from "next/image";

const userSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  role: z.enum(["STUDENT", "TEACHER"] as [string, ...string[]]),
  nimOrNip: z.string().min(3, "NIM/NIP must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  avatarUrl: z.any().optional(), // file input is handled separately
});

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { account } = useAccount();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["user", account?.id],
    queryFn: () => getUserById(account?.id as string),
  });

  const { mutateAsync: onUpdateUser } = useMutation({
    mutationFn: (values: CreateUserType) =>
      updateUser(account?.id as string, values),

    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["user", account?.id] });
    },
    onError: () => {
      toast.error("Failed to update profile.");
    },
  });

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      role: user?.role || "STUDENT",
      nimOrNip: user?.nim || user?.nip || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || "",
        role: user.role || "STUDENT",
        nimOrNip: user.nim || user.nip || "",
        email: user.email || "",
      });
      setPreview(user.avatarUrl || null); // assuming API gives avatarUrl
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof userSchema>) {
    try {
      setIsLoading(true);

      // separate into nim/nip depending on role
      const payload: CreateUserType = {
        ...values,
        nim: values.role === "STUDENT" ? values.nimOrNip : "",
        nip: values.role === "TEACHER" ? values.nimOrNip : "",
      };

      delete (payload as any).nimOrNip; // not needed in backend

      await onUpdateUser(payload);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      form.setValue("avatarUrl", file); // store file in form
    }
  }

  return (
    <section className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-medium">Profile Settings</h2>
      </div>

      <div className="w-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col"
          >
            <div className="mt-4 flex flex-col items-center gap-4">
              {/* Profile Image Preview */}
              <div className="border-primary relative h-24 w-24 overflow-hidden rounded-full border-2">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                    No Image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer text-sm opacity-0"
                />
              </div>
              <p className="text-muted-foreground text-sm">
                Click To Change Profile Image
              </p>

              {/* Upload Input */}
            </div>

            <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="border-primary h-10 w-full rounded-lg border-2 lg:h-12"
                        placeholder="Email"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="border-primary h-10 w-full rounded-lg border-2 lg:h-12"
                        placeholder="Full Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nimOrNip"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="border-primary h-10 w-full rounded-lg border-2 lg:h-12"
                        placeholder="NIM / NIP"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="mt-6 flex h-10 w-full items-center gap-3 text-lg lg:mt-10 lg:h-12"
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
