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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateModuleType, ModuleVisibility } from "@/lib/types/module";
import { createModule } from "@/lib/networks/module";
import { useAccount } from "@/providers/AccountProvider";
import slugify from "slugify";
import { CreateModuleFileType } from "@/lib/types/module-file";
import { createModuleFile } from "@/lib/networks/module-file";
import { useDropzone } from "react-dropzone";
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

export function AddNewModules({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    },
  });

  const { account } = useAccount();
  const queryClient = useQueryClient();

  const { mutateAsync: createModuleMutation } = useMutation({
    mutationFn: (values: CreateModuleType) => createModule(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
  });

  const { mutateAsync: createModuleFileMutation } = useMutation({
    mutationFn: (values: CreateModuleFileType) => createModuleFile(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module-files"] });
    },
  });

  const form = useForm<z.infer<typeof moduleSchema>>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
      visibility: "OPEN",
      isActive: true,
    },
  });

  async function onSubmit(values: z.infer<typeof moduleSchema>) {
    try {
      setIsLoading(true);

      const createdModule = await createModuleMutation({
        title: values.title,
        slug: slugify(values.title, { lower: true, strict: true }),
        description: values.description || "",
        visibility: values.visibility as unknown as ModuleVisibility,
        authorId: account?.id ?? "1",
        isActive: values.isActive,
      } as CreateModuleType);

      const moduleId = createdModule?.id;
      if (!moduleId) {
        throw new Error("Module created but no id returned from server.");
      }

      for (const file of files) {
        await createModuleFileMutation({
          uploadedById: account?.id ?? "1",
          moduleId,
          url: file,
          filename: file.name,
        });
      }

      toast.success("Module and files uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["modules"] });

      form.reset();
      setFiles([]);
      setOpen(false);
    } catch (err) {
      console.error("Module creation failed", err);
      toast.error("Failed to create module or upload files.");
    } finally {
      setIsLoading(false);
    }
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
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

              <div className="flex flex-col gap-4">
                <div
                  {...getRootProps()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-400 p-6 text-center hover:bg-gray-50"
                >
                  <input {...getInputProps()} />
                  <p className="text-gray-600">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports: Images, Docs, PDF
                  </p>
                </div>

                {files.length > 0 && (
                  <ul className="space-y-2">
                    {files.map((file, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between rounded bg-gray-100 px-3 py-1 text-sm text-gray-800"
                      >
                        <span>
                          {file.name} ({Math.round(file.size / 1024)} KB)
                        </span>
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => removeFile(idx)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

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
