import { Semester, Slot } from "@/types/database";
import React from "react";
import columns from "./columns";
import { DataTable as Table } from "@/Components/Table/DataTable";

interface DataTableProps {
    semesters: Semester[];
}

const DataTable: React.FC<DataTableProps> = ({ semesters }) => {
    return (
        <Table
            data={semesters}
            columns={columns}
            inputProps={{
                searchFilter: false,
                pagination: true,
            }}
        />
    );
};

export default DataTable;
