import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FilterIcon } from "lucide-react";
import { ReactNode } from "react";

interface FilterModalProps {
    title: string; // Title of the modal
    description?: string; // Optional description
    onSearch: () => void; // Function to call when the search button is clicked
    children: ReactNode; // Content to render inside the modal
    hasFiltersApplied: boolean; // Indicates if any filters are applied
}

function FilterModal({
    title,
    description,
    onSearch,
    children,
    hasFiltersApplied,
}: FilterModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative inline-flex">
                    <Button variant="outline">
                        <FilterIcon size={16} />
                    </Button>
                    {/* Ping Icon with Pulse Effect */}
                    {hasFiltersApplied && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    )}
                    {hasFiltersApplied && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b border-border px-6 py-4 text-base">
                        {title}
                    </DialogTitle>
                </DialogHeader>
                {description && (
                    <DialogDescription className="sr-only">
                        {description}
                    </DialogDescription>
                )}
                <div className="overflow-y-auto p-6">
                    {/* Use grid layout for better spacing */}
                    <div className="grid grid-cols-1 gap-4">{children}</div>
                </div>
                <DialogFooter className="border-t border-border px-6 py-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={onSearch}>
                        Search
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default FilterModal;