"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DataTable from "@/components/ui/DataTable";
import SearchDataTable from "@/components/ui/SearchDataTable";
import { useAccount } from "@/providers/AccountProvider";
import { getAllUsers, updateUser } from "@/lib/networks/user";
import { userColumn } from "@/lib/columns/user";
import { UserType } from "@/lib/types/user";
import { Button } from "@/components/ui/button";

export default function AddStudentsPage() {
  const { account } = useAccount();
  const queryClient = useQueryClient();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: users } = useQuery({
    queryFn: () => getAllUsers(),
    queryKey: ["users", account?.id],
  });

  const { mutateAsync: updateStudent, isPending: isLoading } = useMutation({
    mutationFn: (values: UserType) => updateUser(values.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedIds([]);
    },
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleAddStudents = async () => {
    if (!account?.id) return;
    await Promise.all(
      selectedIds.map((id) =>
        updateStudent({
          id,
          teacherId: account.id, // 👈 assign logged-in teacher as supervisor
        }),
      ),
    );
  };

  const userWithoutTeacher = users?.filter((u) => u.role !== "LECTURER");

  if (!users) return null;

  return (
    <section className="flex w-full flex-col gap-4 p-6 lg:gap-6">
      {/* Header Title */}
      <div className="flex w-full flex-col justify-between gap-4 lg:flex-row lg:gap-6">
        <div>
          <h1 className="text-4xl font-medium">Add Students</h1>
          <p className="hidden lg:inline">
            Add students to your class from here.
          </p>
        </div>
        <Button
          onClick={handleAddStudents}
          disabled={selectedIds.length === 0 || isLoading}
        >
          {isLoading ? "Adding..." : `Add ${selectedIds.length} Students`}
        </Button>
      </div>

      <DataTable
        columns={userColumn(selectedIds, toggleSelect)}
        data={userWithoutTeacher}
        filters={(table) => (
          <div className="grid gap-4 p-4 lg:grid-cols-4 lg:gap-6">
            <SearchDataTable
              table={table}
              column="name"
              placeholder="Search Full Name..."
            />
            <SearchDataTable
              table={table}
              column="nim"
              placeholder="Search NIM..."
            />
            <SearchDataTable
              table={table}
              column="department"
              placeholder="Search Department..."
            />
          </div>
        )}
      />
    </section>
  );
}
