"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { createModuleFile, deleteModuleFile } from "@/lib/networks/module-file";
import { ModuleType } from "@/lib/types/module";
import { CreateModuleFileType } from "@/lib/types/module-file";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Trash2, Upload } from "lucide-react";
import React, { useRef } from "react";
import { useAccount } from "@/providers/AccountProvider";
import { toast } from "sonner";

export default function ModuleFiles({ module }: { module: ModuleType }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { account } = useAccount();

  const files = module?.files ?? [];

  const isLecturer = account?.role === "LECTURER";

  // CREATE mutation
  const { mutateAsync: createModuleFileMutation, isPending: isUploading } =
    useMutation({
      mutationFn: (values: CreateModuleFileType) => createModuleFile(values),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["modules", module.id],
        });
        toast.success("File uploaded successfully.");
      },
      onError: () => {
        toast.error("Failed to upload file.");
      },
    });

  // DELETE mutation
  const { mutateAsync: deleteModuleFileMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: (fileId: string) => deleteModuleFile(fileId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["modules", module.id],
        });
        toast.success("File deleted successfully.");
      },
      onError: () => {
        toast.error("Failed to delete file.");
      },
    });

  // handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData: CreateModuleFileType = {
      uploadedById: account?.id as string,
      moduleId: module.id as string,
      url: file,
      filename: file.name,
    };

    await createModuleFileMutation(formData);
    if (fileInputRef.current) fileInputRef.current.value = ""; // reset input
  };

  return (
    <section id="modules" className="flex-1 px-6 lg:border-l">
      <div className="flex items-center justify-between py-2">
        <p className="text-lg font-semibold">Module Files</p>

        {/* upload button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          {isLecturer && (
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="mr-2 size-4" />
              {isUploading ? "Uploading..." : "Add File"}
            </Button>
          )}
        </div>
      </div>
      <Separator className="" />

      <div className="mt-2">
        <p className="text-sm font-medium">Readings</p>
        <div>
          {files.length === 0 && (
            <p className="mt-2 text-xs text-gray-500">No files uploaded.</p>
          )}

          {files.map((file) => (
            <div
              key={file.id}
              className="group hover:bg-primary my-3 flex items-center justify-between gap-4 rounded-sm border-2 border-gray-200 px-3 py-2 text-sm text-gray-800 transition hover:border-white hover:text-white"
            >
              <a
                href={file.url as string}
                download={file.filename}
                className="flex flex-1 flex-col"
              >
                <span className="line-clamp-2">{file.filename}</span>
                <span
                  className={`text-xs ${
                    file.url ? "group-hover:text-white" : "text-gray-500"
                  }`}
                >
                  ({Math.round(256 / 1024)} KB)
                </span>
              </a>

              <div className="flex items-center gap-2">
                <Download
                  className={`size-5 shrink-0 text-gray-400 ${
                    file.url ? "group-hover:text-white" : ""
                  }`}
                />
                {isLecturer && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteModuleFileMutation(file.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
