import { Badge } from "@/components/ui/badge"
import Tooltip from "@/components/ui/tooltip"
import { ColumnDef } from "@tanstack/react-table"
import { ShieldCheck, ShieldX } from "lucide-react"
import { Teacher } from "@/types/database"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DataTableColumnHeader
} from "@/Components/Table/FeaturedTable"
import { DataTableRowActions } from "./actions"

export const columns: ColumnDef<Teacher>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    size: 300,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => {
      const isActive = row.original.is_active === 'active'

      return (
        <Tooltip title={isActive ? 'Active' : 'Not-Active'}>
          {isActive ? (
            <ShieldCheck color="green" />
          ) : (
            <ShieldX color="red" />
          )}
        </Tooltip>
      )
    },
  },
  {
    accessorKey: "department.institution.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Institution" />
    ),
    size: 300,
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registration Date" />
    ),
    size: 180,
  },
  {
    accessorKey: "cnic",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CNIC" />
    ),
  },
  {
    accessorKey: "isMale",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => (row.original.isMale ? "Male" : "Female"),
  },
  {
    accessorKey: "date_of_birth",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
  },
  {
    accessorKey: "date_of_joining_in_this_college",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joining Date (College)" />
    ),
  },
  {
    accessorKey: "date_of_joining_govt_service",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joining Date (Govt. Service)" />
    ),
  },
  {
    accessorKey: "date_of_joining_current_rank",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joining Date (Current Rank)" />
    ),
  },
  {
    accessorKey: "father_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Father's Name" />
    ),
  },
  {
    accessorKey: "seniority_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Seniority Number" />
    ),
  },
  {
    accessorKey: "qualification",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qualification" />
    ),
  },
  {
    accessorKey: "highest_degree_awarding_institute",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Degree Institute" />
    ),
  },
  {
    accessorKey: "highest_degree_awarding_country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Degree Country" />
    ),
  },
  {
    accessorKey: "highest_degree_awarding_year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Degree Year" />
    ),
  },
  {
    accessorKey: "degree_title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Degree Title" />
    ),
  },
  {
    accessorKey: "rank",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rank" />
    ),
    size: 200,
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Position" />
    ),
  },
  {
    accessorKey: "department.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    size: 300,
  },
  {
    accessorKey: "isvisiting",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visiting" />
    ),
    cell: ({ row }) => {
      const isVisiting = Boolean(row.original.isvisiting)

      return (
        <Badge variant={"outline"} className={isVisiting ? 'text-green-500' : 'text-red-500'}>
          {isVisiting ? "Yes" : "No"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row.original} />
  },
]

export default columns
