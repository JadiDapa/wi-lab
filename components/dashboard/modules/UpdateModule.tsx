"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateModuleType,
  ModuleType,
  ModuleVisibility,
} from "@/lib/types/module";
import { updateModule, getModulesByAccountId } from "@/lib/networks/module";
import { useAccount } from "@/providers/AccountProvider";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TiptapEditor } from "@/components/ui/TipTapEditor";

const moduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  visibility: z.string(),
  isActive: z.boolean(),
});

export function UpdateModule({
  children,
  module,
}: {
  children: React.ReactNode;
  module: ModuleType;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { account } = useAccount();
  const queryClient = useQueryClient();

  const { data: modules } = useQuery({
    queryKey: ["modules", account?.id],
    queryFn: () => getModulesByAccountId(account?.id as string),
    enabled: !!account?.id,
  });

  console.log(modules);

  const { mutateAsync: updateModuleMutation } = useMutation({
    mutationFn: (values: CreateModuleType) =>
      updateModule(module.id as string, values),
  });

  const form = useForm<z.infer<typeof moduleSchema>>({
    resolver: zodResolver(moduleSchema),
    values: {
      title: module.title || "",
      description: module.description || "",
      visibility: "OPEN",
      isActive: true,
    },
  });

  async function onSubmit(values: z.infer<typeof moduleSchema>) {
    try {
      setIsLoading(true);

      await updateModuleMutation({
        title: values.title,
        slug: slugify(values.title, { lower: true, strict: true }),
        description: values.description || "",
        visibility: values.visibility as unknown as ModuleVisibility,
        authorId: account?.id ?? "1",
        isActive: values.isActive,
      } as CreateModuleType);

      toast.success("Module Updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["modules", module.id] });
      form.reset();
    } catch (err) {
      console.error("Module update failed", err);
      toast.error("Failed to create module or upload files.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-screen flex-col p-6 lg:max-w-lg"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col"
          >
            <SheetHeader className="shrink-0 p-0">
              <SheetTitle>Add New Modules</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-primary h-10 w-full rounded-lg border-2 lg:h-12"
                        placeholder="Module Title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              {/* --- TIPTAP WITH TOOLBAR --- */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TiptapEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
              {/* ------------------------------------------------ */}

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <select
                        disabled={isLoading}
                        className="border-primary h-10 w-full rounded-lg border-2 lg:h-12"
                        {...field}
                      >
                        <option value="OPEN">Open</option>
                        <option value="RESTRICTED">Restricted</option>
                      </select>
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.value}
                          disabled={isLoading}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        Active
                      </label>
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />

              <SheetFooter className="mt-6 flex shrink-0 flex-col gap-2 p-0">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 flex h-10 w-full items-center gap-3 text-lg lg:mt-10 lg:h-12"
                >
                  {isLoading ? "Submitting..." : "Create Module"}
                </Button>
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
              </SheetFooter>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
