import Tooltip from "@/components/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { ShieldCheck, ShieldX } from "lucide-react";

export interface Teacher {
    id: number;
    name: string;
    personnel_number: string;
    email: string;
    cnic: string;
    phone_number: string;
    bank_iban: string;
    isMale: boolean;
    date_of_birth: string;
    date_of_joining_in_this_college: string;
    date_of_joining_govt_service: string;
    date_of_joining_current_rank: string;
    father_name: string;
    seniority_number: number;
    qualification: string;
    highest_degree_awarding_institute: string;
    highest_degree_awarding_country: string;
    highest_degree_awarding_year: number;
    degree_title: string;
    rank: string;
    position: string;
    department_id: number;
    isvisiting: boolean;
    isActive: boolean;
    created_at: string;
    updated_at: string;
}

// Extended columns array
const columns: ColumnDef<Teacher>[] = [
    {
        accessorKey: "id",
        header: "#",
        size: 50,
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
        size: 300,
    },
    {
        accessorKey: "isActive",
        header: "Active",
        cell: ({ row }) => {
            const isActive = row.original.isActive;

            return (
                <Tooltip title={isActive ? 'Active' : 'Not-Active'}>
                    {isActive ? (
                        <ShieldCheck color="green" />
                    ) : (
                        <ShieldX color="red" />
                    )}
                </Tooltip>
            );
        },
    },
    {
        accessorKey: "department.institution.name",
        header: "Institution",
        size: 300,
    },
    {
        accessorKey: "phone_number",
        header: "Phone",
    },
    {
        accessorKey: "registrationDate",
        header: "Registration Date",
        size: 180,
    },
    {
        accessorKey: "cnic",
        header: "CNIC",
    },
    // {
    //     accessorKey: "bank_iban",
    //     header: "Bank IBAN",
    // },
    {
        accessorKey: "isMale",
        header: "Gender",
        cell: ({ row }) => (row.original.isMale ? "Male" : "Female"), // Formatting cell data
    },
    {
        accessorKey: "dob",
        header: "Date of Birth",
    },
    {
        accessorKey: "collegeJoiningDate",
        header: "Joining Date (College)",
    },
    {
        accessorKey: "govtServiceJoiningDate",
        header: "Joining Date (Govt. Service)",
    },
    {
        accessorKey: "currentRankJoiningDate",
        header: "Joining Date (Current Rank)",
    },
    {
        accessorKey: "father_name",
        header: "Father's Name",
    },
    {
        accessorKey: "seniority_number",
        header: "Seniority Number",
    },
    {
        accessorKey: "qualification",
        header: "Qualification",
    },
    {
        accessorKey: "highest_degree_awarding_institute",
        header: "Degree Institute",
    },
    {
        accessorKey: "highest_degree_awarding_country",
        header: "Degree Country",
    },
    {
        accessorKey: "highest_degree_awarding_year",
        header: "Degree Year",
    },
    {
        accessorKey: "degree_title",
        header: "Degree Title",
    },
    {
        accessorKey: "rank",
        header: "Rank",
        size: 200,
    },
    {
        accessorKey: "position",
        header: "Position",
    },
    {
        accessorKey: "department.name",
        header: "Department",
        size: 300,
    },
    {
        accessorKey: "isvisiting",
        header: "Visiting",
        cell: ({ row }) => (row.original.isvisiting ? "Yes" : "No"), // Formatting cell data
    },
];

export default columns;
