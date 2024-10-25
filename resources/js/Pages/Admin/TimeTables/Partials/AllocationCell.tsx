import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Allocation } from "@/types/database";
import { getBackgroundColor } from "@/utils/dayHelper";

export function AllocationCell({
    allocation,
    className,
}: {
    allocation: Allocation;
    className?: string;
}) {
    return (
        <span className={cn("text-sm", className)}>
            {allocation?.course?.code && (
                <span>{allocation?.course?.display_code}</span>
            )}
            {allocation?.teacher?.name && (
                <span> - {allocation?.teacher?.name}</span>
            )}
            {allocation?.room?.name && <span> - {allocation?.room?.name}</span>}
            {allocation.day?.name && (
                <>
                    -{" "}
                    <Badge
                        asChild
                        className={cn(
                            "pointer-events-none",
                            getBackgroundColor(allocation.day?.name)
                        )}
                    >
                        <span>{allocation.day?.name}</span>
                    </Badge>
                </>
            )}
        </span>
    );
}
