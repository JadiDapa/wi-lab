import { ColumnDef } from "@tanstack/react-table";
import { UserType } from "../types/user";
import TableSorter from "@/components/ui/TableSorter";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export const userColumn = (
  selectedIds: string[],
  toggleSelect: (id: string) => void,
): ColumnDef<UserType>[] => [
  {
    id: "select",
    header: () => <div className="px-2">SELECT</div>,
    cell: ({ row }) => {
      const id = row.original.id;
      const isAssigned = !!row.original.teacherId;
      return (
        <Checkbox
          className="mx-4"
          disabled={isAssigned}
          checked={selectedIds.includes(id)}
          onCheckedChange={() => toggleSelect(id)}
        />
      );
    },
  },

  {
    accessorKey: "avatar",
    accessorFn: (row) => row.avatarUrl,
    header: ({ column }) => <TableSorter column={column} header="AVATAR" />,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <Avatar className="size-10">
          <AvatarImage src={user.avatarUrl || ""} alt={user.fullName} />
          <AvatarFallback>
            {user.fullName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    accessorFn: (row) => row.fullName,
    header: ({ column }) => <TableSorter column={column} header="FULL NAME" />,
    cell: ({ getValue }) => (
      <div className="text-base">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "nim",
    accessorFn: (row) => row.nim,
    header: ({ column }) => <TableSorter column={column} header="NIM" />,
    cell: ({ getValue }) => (
      <div className="text-base">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "department",
    accessorFn: (row) => row.department,
    header: ({ column }) => <TableSorter column={column} header="DEPARTMENT" />,
    cell: ({ getValue }) => (
      <div className="line-clamp-2 w-80 text-sm break-words whitespace-pre-wrap">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "teacher",
    accessorFn: (row) => row.teacher?.fullName || "-",
    header: ({ column }) => <TableSorter column={column} header="TEACHER" />,
    cell: ({ getValue }) => (
      <div className="line-clamp-2 w-80 text-sm break-words whitespace-pre-wrap">
        {getValue() as string}
      </div>
    ),
  },
];
