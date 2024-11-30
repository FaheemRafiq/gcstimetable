import React, { useMemo } from "react";
import { Semester } from "@/types/database";
import columns from "./columns";
import { DataTable as Table } from "@/Components/Table/DataTable";

interface DataTableProps {
    semesters: Semester[];
    columns?: any;
    searchFilter?: boolean;
    filterColumn?: string;
    pagination?: boolean;
    isMainListing?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
    semesters,
    columns : columnsProps = undefined,
    searchFilter = false,
    filterColumn = "name",
    pagination = false
}) => {
    return (
        <Table
            data={semesters}
            columns={columnsProps ?? columns}
            inputProps={{
                searchFilter: searchFilter,
                filterColumn: filterColumn,
                pagination: pagination,
            }}
        />
    );
};

export default DataTable;
