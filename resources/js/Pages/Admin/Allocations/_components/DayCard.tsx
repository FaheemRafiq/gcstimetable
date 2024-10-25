import React from "react";
import { cn } from "@/lib/utils";
import { Day } from "@/types/database";
import { dayCardClasses, getBackgroundColor, getBorderColor, getShadowColor } from "@/utils/dayHelper";

interface DayCardProps extends React.HTMLAttributes<HTMLDivElement> {
    day: Day;
    selected: boolean;
    children: React.ReactNode;
}

const DayCard: React.FC<DayCardProps> = ({
    day,
    selected,
    children,
    className,
    ...props
}) => {

    return (
        <div
            key={day.id}
            {...props}
            className={cn(
                `relative text-center min-h-[120px] h-full overflow-hidden border rounded-lg transition-all duration-300`,
                className,
                getBorderColor(day.name),
                selected && `scale-110 shadow-md ${getShadowColor(day.name)}`,
            )}
        >
            <div
                className={cn(
                    "text-center font-semibold",
                    getBackgroundColor(day.name)
                )}
            >
                {day.name}
            </div>
            <div
                className={cn(
                    "flex items-start justify-center h-full cursor-pointer"
                )}
            >
                {children}
            </div>
        </div>
    );
};

export default DayCard;
