import { Slot } from "@/types/database";
import React from "react";
import columns from "./columns";
import { DataTable as Table } from "@/Components/Table/DataTable";

interface DataTableProps {
    slots: Slot[];
}

const DataTable: React.FC<DataTableProps> = ({ slots }) => {
    return (
        <Table
            data={slots}
            columns={columns}
            inputProps={{
                searchFilter: false,
                pagination: false,
            }}
        />
    );
};

export default DataTable;
