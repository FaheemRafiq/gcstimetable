import { Badge } from "@/components/ui/badge";
import React from "react";

interface ColumnBadgeProps {
    isActive: boolean;
}

const ColumnBadge: React.FC<ColumnBadgeProps> = ({ isActive }) => {
    return (
        <>
            {isActive ? (
                <Badge variant={"successOutline"}>Yes</Badge>
            ) : (
                <Badge variant={"destructiveOutline"}>No</Badge>
            )}
        </>
    );
};

export default ColumnBadge;
