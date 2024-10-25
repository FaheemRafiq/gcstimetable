import { Icon } from "@/components/app-sidebar";
import React from "react";

interface InformationProps {
    icon: Icon,
    title: string,
    value: string,
    jsxValue?: JSX.Element,
}

const Information: React.FC<InformationProps> = ({
    icon : Icon,
    title,
    value,
    jsxValue,
}) => {
    return (
        <div className="mb-4 flex flex-col sm:flex-row">
            <span className="font-bold sm:w-4/12 lg:w-2/12 flex items-center">
                <Icon size={18} className="mr-1" />
                {title}:{" "}
            </span>
            <span className="ps-5 sm:ps-0 flex-1">
                {jsxValue ? jsxValue : value}
            </span>
        </div>
    );
};

export default Information;
