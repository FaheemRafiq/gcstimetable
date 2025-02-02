import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { router } from "@inertiajs/react";
import { XIcon } from "lucide-react";
import FilterModal from "@/components/filter-modal";
import InputLabel from "@/Components/InputLabel";
import DatePicker from "@/components/inputs/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SearchInput from "@/components/inputs/search-input";

// Define initial state and types
type FilterState = {
    s: string;
    start_date: string;
    end_date: string;
    verified: boolean;
    unverified: boolean;
    sFrom: "" | "url-first" | "search";
};

const initialState: FilterState = {
    s: "",
    start_date: "",
    end_date: "",
    verified: true,
    unverified: true,
    sFrom: "",
};

function UserFilters() {
    // Main filter state
    const [filters, setFilters] = useState<FilterState>(initialState);

    // Update state from URL on mount
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        setFilters({
            s: searchParams.get("s") || "",
            start_date: searchParams.get("start_date") || "",
            end_date: searchParams.get("end_date") || "",
            verified: searchParams.get("verified") === "false" ? false : true,
            unverified: searchParams.get("unverified") === "false" ? false : true,
            sFrom: "url-first"
        });
    }, []);

    useEffect(() => {
        if(filters.sFrom == "search"){
            handleSearch();
        }
    }, [filters.s, filters.sFrom]);


    // Handle date changes
    const handleDateChange = (name: "start_date" | "end_date", date: Date | null) => {
        setFilters(prev => ({
            ...prev,
            [name]: date ? format(date, "yyyy-MM-dd") : ""
        }));
    };

    // Handle search submission
    const handleSearch = () => {
        const queryParams: Record<string, any> = {};

        // Only add non-default values to query params
        if (filters.s) queryParams.s = filters.s;
        if (filters.start_date) queryParams.start_date = filters.start_date;
        if (filters.end_date) queryParams.end_date = filters.end_date;
        if (!filters.verified) queryParams.verified = false;
        if (!filters.unverified) queryParams.unverified = false;

        router.get(route("users.index"), queryParams, { preserveState: true });
    };

    // Clear all filters
    const handleClearFilters = () => {
        setFilters(initialState);
        router.get(route("users.index"));
    };

    // Remove individual filter
    const removeFilter = (filterName: keyof FilterState) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: initialState[filterName]
        }));
    };

    // Check if any filter is active
    const hasActiveFilters = () => {
        return Object.entries(filters).some(([key, value]) => {

            if (key == 's' || key == 'sFrom') {
                return false;
            }

            if (typeof value === 'boolean') {
                return value !== initialState[key as keyof FilterState];
            }
            return value !== '';
        });
    };

    // Generate filter badges
    const getFilterBadges = () => {
        const badges = [];

        if (filters.start_date) {
            badges.push(
                <Badge
                    key="start_date"
                    variant="secondary"
                    className="!text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => removeFilter('start_date')}
                >
                    Start Date: {filters.start_date}
                    <XIcon size={12} className="ml-1 inline" />
                </Badge>
            );
        }

        if (filters.end_date) {
            badges.push(
                <Badge
                    key="end_date"
                    variant="secondary"
                    className="!text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => removeFilter('end_date')}
                >
                    End Date: {filters.end_date}
                    <XIcon size={12} className="ml-1 inline" />
                </Badge>
            );
        }

        if (!filters.verified) {
            badges.push(
                <Badge
                    key="verified"
                    variant="secondary"
                    className="!text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => removeFilter('verified')}
                >
                    Verified: No
                    <XIcon size={12} className="ml-1 inline" />
                </Badge>
            );
        }

        if (!filters.unverified) {
            badges.push(
                <Badge
                    key="unverified"
                    variant="secondary"
                    className="!text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => removeFilter('unverified')}
                >
                    Unverified: No
                    <XIcon size={12} className="ml-1 inline" />
                </Badge>
            );
        }

        return badges;
    };

    return (
        <div className="flex justify-between items-center gap-5">
            <div className="flex-1">
                <SearchInput
                    value={filters.s}
                    setValue={(value) => {
                        setFilters(prev => ({ ...prev, s: value, sFrom: "search" }));
                    }}
                    placeholder="Search user by name, email..."
                    autoSearch={true}
                    debounceDelay={500}
                />
            </div>
            <div className="self-end">
                <FilterModal
                    title="User Filters"
                    description="Adjust your filters to find the perfect user."
                    onSearch={handleSearch}
                    hasFiltersApplied={hasActiveFilters()}
                >
                    {/* Active Filters Section */}
                    {hasActiveFilters() && (
                        <>
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Active Filters</div>
                                <div className="flex flex-wrap gap-2">
                                    {getFilterBadges()}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClearFilters}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    >
                                        Clear All
                                    </Button>
                                </div>
                            </div>
                            <Separator className="my-4" />
                        </>
                    )}

                    {/* Date Filters Section */}
                    <div className="space-y-4">
                        <div className="text-sm font-medium">Date Range</div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="start_date" value="Start Date" />
                                <DatePicker
                                    className="w-full"
                                    id="start_date"
                                    value={filters.start_date ? new Date(filters.start_date) : null}
                                    onChange={(date) => handleDateChange("start_date", date)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="end_date" value="End Date" />
                                <DatePicker
                                    className="w-full"
                                    id="end_date"
                                    value={filters.end_date ? new Date(filters.end_date) : null}
                                    onChange={(date) => handleDateChange("end_date", date)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status Filters Section */}
                    <div className="space-y-4 mt-4">
                        <div className="text-sm font-medium">User Status</div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="verified"
                                    checked={filters.verified}
                                    onCheckedChange={(checked) =>
                                        setFilters(prev => ({ ...prev, verified: !!checked }))
                                    }
                                />
                                <Label htmlFor="verified">Verified Users</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="unverified"
                                    checked={filters.unverified}
                                    onCheckedChange={(checked) =>
                                        setFilters(prev => ({ ...prev, unverified: !!checked }))
                                    }
                                />
                                <Label htmlFor="unverified">Unverified Users</Label>
                            </div>
                        </div>
                    </div>
                </FilterModal>
            </div>
        </div>
    );
}

export default UserFilters;