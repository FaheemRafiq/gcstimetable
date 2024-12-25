import { Fragment, useState } from "react";

// Types
import { PageProps } from "@/types";
import { Section } from "@/types/database";

// Components
import columns from "./_components/columns";
import { DataTable } from "@/Components/Table/DataTable";
import { SectionForm } from "./_components/SectionForm";

export default function IndexPage({
    sections,
    semesterId,
}: {
    sections: Section[] | [];
    semesterId: number;
}) {
    return (
        <Fragment>
            <div className="flex justify-between">
                <h3 className="text-lg font-semibold mb-2">Sections</h3>
                <SectionForm semesterId={semesterId} />
            </div>
            <DataTable
                data={sections}
                columns={columns}
                inputProps={{
                    searchFilter: false,
                    // filterColumn: "email",
                    pagination: false,
                }}
            />
        </Fragment>
    );
}
