import { Semester, Slot } from "@/types/database";
import React from "react";
import columns from "./columns";
import { DataTable as Table } from "@/Components/Table/DataTable";

interface DataTableProps {
    semesters: Semester[];
    searchFilter?: boolean;
    filterColumn?: string;
    pagination?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
    semesters,
    searchFilter = false,
    filterColumn = "name",
    pagination = false,
}) => {
    return (
        <Table
            data={semesters}
            columns={columns}
            inputProps={{
                searchFilter: searchFilter,
                filterColumn: filterColumn,
                pagination: pagination,
            }}
        />
    );
};

export default DataTable;
